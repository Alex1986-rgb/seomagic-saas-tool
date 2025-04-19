
import React from 'react';
import { CheckCircle } from 'lucide-react';

const Registration: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold flex items-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2">1</span>
        Регистрация и вход
      </h3>
      <div className="ml-8 mt-4 space-y-4">
        <p>Для начала работы необходимо зарегистрироваться или войти в систему:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Нажмите кнопку «Регистрация» в верхнем правом углу главной страницы.</li>
          <li>Заполните необходимые поля: имя, электронная почта и пароль.</li>
          <li>Подтвердите адрес электронной почты, перейдя по ссылке в письме.</li>
          <li>После подтверждения вы можете войти в систему, используя вашу электронную почту и пароль.</li>
        </ol>
      </div>
    </section>
  );
};

export default Registration;
