
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Plus, Copy, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ApiKeysPage = () => {
  const { toast } = useToast();
  const [showNewKeyForm, setShowNewKeyForm] = React.useState(false);
  const [keyName, setKeyName] = React.useState("");
  const [showCopiedAlert, setShowCopiedAlert] = React.useState(false);
  const [apiKeys, setApiKeys] = React.useState([
    { name: "Основной ключ", key: "sk_live_123...abc", created: "2025-04-20" },
    { name: "Тестовый ключ", key: "sk_test_456...xyz", created: "2025-04-19" },
  ]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 3000);
  };

  const handleCreateKey = () => {
    if (!keyName.trim()) {
      toast({ title: "Введите название ключа", variant: "destructive" });
      return;
    }
    const rand = Math.random().toString(36).slice(2, 8);
    const today = new Date().toISOString().slice(0, 10);
    setApiKeys((prev) => [...prev, { name: keyName.trim(), key: `sk_live_${rand}...key`, created: today }]);
    setKeyName("");
    setShowNewKeyForm(false);
    toast({ title: "Ключ создан", description: "Новый API-ключ добавлен" });
  };

  const handleDeleteKey = (index: number) => {
    setApiKeys((prev) => prev.filter((_, i) => i !== index));
    toast({ title: "Ключ удалён" });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-3">API ключи и доступ</h2>
      <p className="mb-4 text-muted-foreground">
        Управление API ключами для интеграции сторонних сервисов.
      </p>

      {showCopiedAlert && (
        <Alert className="mb-6 bg-green-500/10 border-green-500/20">
          <AlertDescription className="text-green-600">
            Ключ скопирован в буфер обмена
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium">Активные API ключи</h3>
            <Button 
              onClick={() => setShowNewKeyForm(true)} 
              className="flex gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Создать ключ
            </Button>
          </div>

          {showNewKeyForm && (
            <div className="mb-6 p-4 border rounded-lg">
              <Label htmlFor="keyName">Название ключа</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="keyName"
                  placeholder="Например: Интеграция с CRM"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
                <Button onClick={handleCreateKey}>
                  Создать
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {apiKeys.map((apiKey, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{apiKey.name}</p>
                    <p className="text-sm text-muted-foreground">Создан: {apiKey.created}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyKey(apiKey.key)}
                    className="flex gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Копировать
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex gap-2"
                    onClick={() => handleDeleteKey(index)}
                  >
                    <Trash className="h-4 w-4" />
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-sm text-muted-foreground space-y-2">
        <div><b>Безопасность:</b> все API ключи зашифрованы и хранятся в безопасном месте.</div>
        <ul className="list-disc pl-5">
          <li>Автоматическая ротация ключей</li>
          <li>Мониторинг использования</li>
          <li>Ограничение по IP-адресам</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiKeysPage;
