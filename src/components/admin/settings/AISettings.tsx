import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from 'lucide-react';

/**
 * Настройки ИИ.
 *
 * Здесь была форма «OpenAI API Ключ» с выбором GPT-4o, переключатели
 * «автоматического сканирования» и «исправления ошибок», качество, токены и
 * температура, карточки DALL-E, Hugging Face, Claude и Gemini со своими полями
 * ключей. После «Сохранить» появлялись тост «Настройки AI успешно обновлены» и
 * надпись «API ключ сохранен. Все функции ИИ активированы».
 *
 * На деле ключ жил в памяти вкладки до перезагрузки, модель и параметры
 * клались в браузер и до сервера не доходили, ключи Claude, Gemini и
 * Hugging Face не сохранялись вовсе, а кнопка «Сохранить настройки интеграций»
 * не имела обработчика. Тексты оптимизации пишет языковая модель на сервере
 * (supabase/functions/_shared/llm.ts): поставщик и ключ задаются секретами
 * проекта, и из браузера на них повлиять нельзя.
 */

/** Под этим ключом старые версии страницы держали ключ OpenAI открытым текстом. */
const LEGACY_OPENAI_KEY = 'openai_api_key';

const AISettings: React.FC = () => {
  // Если ключ когда-то вводили в старой версии, он мог остаться в браузере.
  // Стираем при заходе на вкладку; недоступное хранилище не ошибка.
  useEffect(() => {
    try {
      window.localStorage.removeItem(LEGACY_OPENAI_KEY);
    } catch {
      /* хранилище недоступно — в нём и нечего удалять */
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Языковая модель</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Модель выбирается на сервере, а не здесь</CardTitle>
          <CardDescription>
            Ключи и модель в браузер не вводятся и из админки не сохраняются.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Тексты и мета-теги при оптимизации пишет языковая модель в серверных функциях. По
            умолчанию в проекте это DeepSeek (модель deepseek-flash).
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              поставщик задаётся секретом LLM_PROVIDER: <code>deepseek</code> или{' '}
              <code>anthropic</code>; если он не задан, берётся тот, чей ключ прописан;
            </li>
            <li>
              ключи — секреты DEEPSEEK_API_KEY и ANTHROPIC_API_KEY, модель можно переопределить
              секретами DEEPSEEK_MODEL и ANTHROPIC_MODEL;
            </li>
            <li>
              секреты меняются в панели Supabase, раздел Edge Functions → Secrets; без ключа
              оптимизация честно откажется работать.
            </li>
          </ul>
          <p>
            Интеграций с DALL-E, Hugging Face и Gemini в сервисе нет.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISettings;
