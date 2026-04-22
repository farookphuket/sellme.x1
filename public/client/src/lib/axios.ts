import axios from 'axios';
import { getCookie } from 'cookies-next'; // อย่าลืมลงแพ็คเกจ: npm install cookies-next

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json', // แนะนำให้เพิ่มเพื่อให้ Laravel ตอบกลับเป็น JSON เสมอ
    },
    withCredentials: true, // สำคัญมากสำหรับ Sanctum (CSRF)
});

// --- เพิ่มส่วนนี้เข้าไปครับ (Interceptor) ---
api.interceptors.request.use(
    (config) => {
        // ดึง Token จาก Cookie ที่เราเก็บไว้ตอน Login
        const token = getCookie('token');

        // ถ้ามี Token ให้ใส่เข้าไปใน Header 'Authorization'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;


/*
 * ======= this is the old code before update
 * ======= last update 30 Mar 2026
import axios from 'axios';

const api = axios.create({

    baseURL: process.env.NEXT_PUBLIC_API_URL,

    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    },
    withCredentials: true, // สำคัญมากสำหรับการใช้ Laravel Sanctum
});

export default api;

*/
