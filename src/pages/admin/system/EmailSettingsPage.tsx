
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EmailSettingsPage = () => {
  const [testEmailStatus, setTestEmailStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [smtpProvider, setSmtpProvider] = React.useState('smtp');

  const handleTestEmail = () => {
    setTestEmailStatus('sending');
    setTimeout(() => {
      setTestEmailStatus('success');
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-3">Настройки почты</h2>
      <p className="mb-4 text-muted-foreground">
        Конфигурация почтового сервера и шаблонов уведомлений.
      </p>

      {testEmailStatus === 'success' && (
        <Alert className="mb-6 bg-green-500/10 border-green-500/20">
          <AlertDescription className="text-green-600">
            Тестовое письмо успешно отправлено
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Провайдер</Label>
              <Select value={smtpProvider} onValueChange={setSmtpProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите провайдера" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smtp">SMTP Сервер</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Хост</Label>
                <Input id="smtpHost" placeholder="smtp.example.com" />
              </div>
              <div>
                <Label htmlFor="smtpPort">SMTP Порт</Label>
                <Input id="smtpPort" placeholder="587" type="number" />
              </div>
              <div>
                <Label htmlFor="smtpUser">Пользователь</Label>
                <Input id="smtpUser" placeholder="user@example.com" />
              </div>
              <div>
                <Label htmlFor="smtpPass">Пароль</Label>
                <Input id="smtpPass" type="password" placeholder="••••••••" />
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <Button 
                onClick={handleTestEmail}
                variant="outline"
                disabled={testEmailStatus === 'sending'}
                className="flex gap-2"
              >
                <Send className="h-4 w-4" />
                {testEmailStatus === 'sending' ? 'Отправка...' : 'Отправить тест'}
              </Button>
              <Button className="flex gap-2">
                <Save className="h-4 w-4" />
                Сохранить настройки
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Шаблоны писем</h3>
          <div className="space-y-4">
            {[
              { name: "Приветственное письмо", status: "Активен" },
              { name: "Сброс пароля", status: "Активен" },
              { name: "Подтверждение email", status: "Активен" },
              { name: "Уведомление о входе", status: "Отключен" },
            ].map((template, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-muted-foreground">Статус: {template.status}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Редактировать
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-sm text-muted-foreground space-y-2">
        <div><b>Возможности:</b> настройка SMTP, шаблоны писем, тестирование отправки.</div>
        <ul className="list-disc pl-5">
          <li>Поддержка различных почтовых провайдеров</li>
          <li>Отслеживание статуса доставки</li>
          <li>Кастомизация шаблонов</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailSettingsPage;
