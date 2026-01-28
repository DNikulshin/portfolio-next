import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function POST() {
  // В реальном приложении этот эндпоинт должен быть надежно защищен
  try {
    console.log('Запуск процесса полного сброса и восстановления БД...');
    // Используем правильную команду из package.json
    const { stdout, stderr } = await execAsync('npm run prisma:reset');

    // Команда `prisma migrate reset` может выводить много информации в stderr, 
    // которая не является критической ошибкой. Будем считать успехом, если команда завершилась.
    if (stderr && !stderr.includes('successfully executed')) {
      console.warn(`Вывод в stderr при выполнении reset: ${stderr}`);
    }

    console.log(`Reset и seed выполнены успешно: ${stdout}`);
    return NextResponse.json({ message: 'База данных успешно сброшена и заполнена начальными данными.', output: stdout }, { status: 200 });

  } catch (error: any) {
    console.error('Критическая ошибка при запуске команды prisma:reset:', error);
    return NextResponse.json({ error: `Внутренняя ошибка сервера: ${error.message}`, stderr: error.stderr, stdout: error.stdout }, { status: 500 });
  }
}
