import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2, RotateCcw, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { PricingService } from '@/services/audit/issues/PricingService';

/**
 * Цены оптимизации — редактор настоящего прайса.
 *
 * Раньше здесь были семь полей с зашитыми в код ценами («Базовая цена за
 * страницу 500 ₽», «Мета-описание 50 ₽»…), блок «Скидки за объём 5/10/15 %» и
 * кнопка, которая ничего не записывала, но отвечала «Настройки цен сохранены.
 * Новые цены будут применены к будущим аудитам». Сметы при этом считались по
 * таблице pricing_rules, которую эта форма не читала и не меняла. Скидок за
 * объём в расчёте нет вовсе.
 *
 * Теперь форма читает и пишет pricing_rules. Менять прайс база разрешает только
 * роли администратора: запрет приходит не ошибкой, а пустым ответом (обновлено
 * ноль строк), поэтому успех показываем, только когда база вернула изменённую
 * строку.
 */

type IssueCategory = Database['public']['Enums']['issue_category'];
type PricingRuleRow = Pick<
  Database['public']['Tables']['pricing_rules']['Row'],
  'id' | 'rule_name' | 'issue_type' | 'category' | 'price_per_item' | 'is_bundle' | 'bundle_includes' | 'sort_order' | 'is_active'
>;

interface EditableRule {
  id: string;
  ruleName: string;
  issueType: string;
  category: IssueCategory;
  isBundle: boolean;
  bundleIncludes: string[];
  /** Что сейчас лежит в базе — с этим сравниваем, чтобы понять, что поменяли. */
  savedPrice: number;
  savedActive: boolean;
  /** Значение поля как есть: пустое или кривое число не превращаем молча в ноль. */
  price: string;
  isActive: boolean;
}

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  seo: 'SEO',
  content: 'Контент',
  technical: 'Техника',
  performance: 'Скорость',
  accessibility: 'Доступность',
  security: 'Безопасность',
};

const toEditable = (row: PricingRuleRow): EditableRule => {
  const price = Number(row.price_per_item);
  // Смета берёт только правила с is_active = true, пустое значение для неё — «выключено».
  const isActive = row.is_active === true;
  return {
    id: row.id,
    ruleName: row.rule_name,
    issueType: row.issue_type,
    category: row.category,
    isBundle: row.is_bundle === true,
    bundleIncludes: Array.isArray(row.bundle_includes)
      ? row.bundle_includes.filter((item): item is string => typeof item === 'string')
      : [],
    savedPrice: price,
    savedActive: isActive,
    price: String(price),
    isActive,
  };
};

/** Цена из поля ввода: неотрицательное число с копейками, иначе null. */
const parsePrice = (value: string): number | null => {
  const normalized = value.replace(',', '.').trim();
  if (normalized === '') return null;
  const num = Number(normalized);
  if (!Number.isFinite(num) || num < 0) return null;
  return Math.round(num * 100) / 100;
};

const isChanged = (rule: EditableRule): boolean =>
  parsePrice(rule.price) !== rule.savedPrice || rule.isActive !== rule.savedActive;

const PricingSettings: React.FC = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<EditableRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadRules = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('id, rule_name, issue_type, category, price_per_item, is_bundle, bundle_includes, sort_order, is_active')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setRules((data ?? []).map(toEditable));
    } catch (err) {
      console.error('Не удалось загрузить прайс:', err);
      setLoadError(err instanceof Error ? err.message : 'Не удалось загрузить прайс');
      setRules([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const ruleNames = useMemo(
    () => new Map(rules.map((rule) => [rule.issueType, rule.ruleName])),
    [rules],
  );
  const singleRules = rules.filter((rule) => !rule.isBundle);
  const bundleRules = rules.filter((rule) => rule.isBundle);
  const changedRules = rules.filter(isChanged);
  const invalidRules = rules.filter((rule) => parsePrice(rule.price) === null);

  const updateRule = (id: string, patch: Partial<Pick<EditableRule, 'price' | 'isActive'>>) => {
    setRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
  };

  const handleReset = () => {
    setRules((prev) =>
      prev.map((rule) => ({ ...rule, price: String(rule.savedPrice), isActive: rule.savedActive })),
    );
  };

  const handleSave = async () => {
    if (invalidRules.length > 0) {
      toast({
        title: 'Цены не сохранены',
        description: `Проверьте цену: ${invalidRules.map((rule) => rule.ruleName).join(', ')}. Нужно неотрицательное число.`,
        variant: 'destructive',
      });
      return;
    }
    if (changedRules.length === 0) return;

    setIsSaving(true);
    const savedIds = new Set<string>();
    const errors: string[] = [];
    let denied = false;

    try {
      for (const rule of changedRules) {
        const price = parsePrice(rule.price);
        if (price === null) continue;

        const { data, error } = await supabase
          .from('pricing_rules')
          .update({ price_per_item: price, is_active: rule.isActive })
          .eq('id', rule.id)
          .select('id');

        if (error) {
          errors.push(`${rule.ruleName}: ${error.message}`);
        } else if (!data || data.length === 0) {
          // Строка есть, но база её не обновила — сработал запрет для не-администратора.
          denied = true;
        } else {
          savedIds.add(rule.id);
        }
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : 'Сбой соединения с базой');
    } finally {
      setIsSaving(false);
    }

    if (savedIds.size > 0) {
      PricingService.clearCache();
      setRules((prev) =>
        prev.map((rule) => {
          if (!savedIds.has(rule.id)) return rule;
          const price = parsePrice(rule.price) ?? rule.savedPrice;
          return { ...rule, savedPrice: price, savedActive: rule.isActive, price: String(price) };
        }),
      );
    }

    const notSaved = changedRules.length - savedIds.size;
    if (notSaved === 0) {
      toast({
        title: 'Цены сохранены',
        description: `Обновлено правил: ${savedIds.size}. Новые сметы считаются по этим ценам, уже выставленные не меняются.`,
      });
      return;
    }

    const reasons: string[] = [];
    if (denied) reasons.push('менять прайс может только пользователь с ролью администратора');
    if (errors.length > 0) reasons.push(errors[0]);
    toast({
      title: savedIds.size > 0 ? 'Сохранена только часть цен' : 'Цены не сохранены',
      description: `Не записано правил: ${notSaved}. ${reasons.join('; ')}.`,
      variant: 'destructive',
    });
  };

  const renderRule = (rule: EditableRule) => {
    const priceInvalid = parsePrice(rule.price) === null;
    const inputId = `price-${rule.id}`;
    return (
      <div
        key={rule.id}
        className="flex flex-col gap-3 py-3 border-b last:border-0 md:flex-row md:items-center"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Label htmlFor={inputId} className="font-medium">{rule.ruleName}</Label>
            <Badge variant="outline">{CATEGORY_LABELS[rule.category] ?? rule.category}</Badge>
            {isChanged(rule) && <Badge variant="secondary">изменено</Badge>}
          </div>
          <p className="text-xs text-muted-foreground mt-1 break-words">
            {rule.isBundle && rule.bundleIncludes.length > 0
              ? `Входит: ${rule.bundleIncludes.map((type) => ruleNames.get(type) ?? type).join(', ')}`
              : rule.issueType}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Input
              id={inputId}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={rule.price}
              onChange={(e) => updateRule(rule.id, { price: e.target.value })}
              className={`w-28 ${priceInvalid ? 'border-destructive' : ''}`}
              disabled={isSaving}
            />
            <span className="text-sm text-muted-foreground">₽</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id={`active-${rule.id}`}
              checked={rule.isActive}
              onCheckedChange={(checked) => updateRule(rule.id, { isActive: checked })}
              disabled={isSaving}
            />
            <Label htmlFor={`active-${rule.id}`} className="text-sm text-muted-foreground">
              {rule.isActive ? 'В смете' : 'Выключено'}
            </Label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Цены оптимизации</h3>
        <p className="text-sm text-muted-foreground">
          Прайс, по которому считается смета: цена за исправление одной найденной проблемы и цены
          пакетов. Изменения записываются в базу и действуют для смет, посчитанных после сохранения.
          Менять прайс может только пользователь с ролью администратора — остальным база откажет.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Загружаем прайс из базы...
        </div>
      ) : loadError ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Прайс не загрузился</AlertTitle>
          <AlertDescription>
            <p>{loadError}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={loadRules}>
              Повторить
            </Button>
          </AlertDescription>
        </Alert>
      ) : rules.length === 0 ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>В прайсе нет ни одного правила</AlertTitle>
          <AlertDescription>
            Смета без правил получится нулевой. Правила добавляются в таблицу pricing_rules.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {singleRules.length > 0 && (
            <div>
              <h4 className="font-medium mb-1">За одну проблему</h4>
              <div>{singleRules.map(renderRule)}</div>
            </div>
          )}

          {bundleRules.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-1">Пакеты</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Если в аудите нашлись все проблемы пакета и цена пакета ниже суммы по отдельности,
                разница идёт в смету скидкой.
              </p>
              <div>{bundleRules.map(renderRule)}</div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving || changedRules.length === 0}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Отменить правки</span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || changedRules.length === 0}
              className="gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>
                {isSaving
                  ? 'Сохранение...'
                  : changedRules.length > 0
                    ? `Сохранить цены (${changedRules.length})`
                    : 'Сохранить цены'}
              </span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PricingSettings;
