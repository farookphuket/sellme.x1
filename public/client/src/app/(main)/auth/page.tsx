"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Github } from 'lucide-react';

import { useRouter } from 'next/navigation'; // สำหรับ Next.js App Router

// ในหน้า Login (handleSubmit)
import { setCookie } from 'cookies-next'; // แนะนำให้ลง lib นี้: npm install cookies-next

export default function AuthPage() {


// ใน Component ของคุณ
const router = useRouter();

const getRedirectPath = (role) => {
  switch (role) {
    case 'root':     return '/admin/dashboard';
    case 'boss':      return '/management';
    case 'account':   return '/account';
    case 'booking':   return '/booking';
    case 'staff':     return '/staff';
    case 'agency':    return '/agency';
    // case 'customer':  return '/profile';
    default:          return '/profile';
  }
};


const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // เช็กว่ากรอกข้อมูลครบตามเงื่อนไขหรือไม่
  useEffect(() => {
    const { name, email, password, confirmPassword } = formData;
    if (mode === 'login') {
setError(null)
      setIsFormValid(email.includes('@') && password.length >= 3);
    } else if (mode === 'signup') {
            setError(null)
      setIsFormValid(
        name.length > 2 &&
        email.includes('@') &&
        password.length >= 3 &&
        password === confirmPassword
      );
    } else {
            setError(null)
      setIsFormValid(email.includes('@'));
    }
  }, [formData, mode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // ดึง URL จาก .env.local
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (res.ok) {

                // ... เมื่อ Login สำเร็จ ...
                setCookie('token', result.data.access_token);
                setCookie('user_role', result.data.user.role);
                // user token to cookie

                // 1. เก็บ Token (อาจจะเก็บใน Cookie เพื่อใช้กับ Middleware ฝั่ง Next.js ได้ดีกว่า)
                localStorage.setItem('token', result.data.access_token);

                // 2. ดึง Role มาตรวจสอบ (สมมติ Laravel ส่งมาใน result.data.user.role)
                const userRole = result.data.user.role;


                // 3. หาเส้นทางที่ต้องไป
                const destination = getRedirectPath(userRole);

                // 4. พาผู้ใช้ไปหน้านั้น
               router.push(destination);

            } else {
              //  setError(result.message || "Login failed");
// ❌ เคส Error แยกตาม Status Code
            switch (res.status) {
                case 401:
                    setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
                    break;
                case 422:
                    // Laravel Validation Error (เช่น Email ซ้ำ หรือ Password สั้นไป)
                    const firstError = result.errors ? Object.values(result.errors)[0][0] : result.message;
                    setError(firstError || "ข้อมูลไม่ถูกต้องตามเงื่อนไข");
                    break;
                case 429:
                    setError("คุณพยายามเข้าระบบบ่อยเกินไป กรุณารอซักครู่");
                    break;
                case 500:
                    setError("เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาติดต่อผู้ดูแลระบบ");
                    break;
                default:
                    setError(result.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
            }

            }
        } catch (err) {
            setError("Connection error");
        } finally {
            setLoading(false);
        }

        /*

    const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
    });
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.data.access_token);
        // ... redirect based on data.data.user.role
    }
    */
}

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat">
      {/* Overlay พื้นหลังสีเทาเข้มเพื่อให้กระจกเด่นขึ้น */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>

      {/* Glass Container */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 text-white">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h1>
            <p className="text-gray-300 mt-2 text-sm">
              {mode === 'login' && 'Please enter your details to sign in'}
              {mode === 'signup' && 'Join us to start your journey'}
              {mode === 'forgot' && 'Enter your email to get reset link'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                onChange={handleChange}
              />
            </div>

            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  onChange={handleChange}
                />
              </div>
            )}

            {mode === 'signup' && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  onChange={handleChange}
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  onClick={() => setMode('forgot')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* ส่วนแสดง Error Message */}
            {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg mb-4 animate-shake">
                ⚠️ {error}
            </div>
            )}

            <button
              disabled={!isFormValid || loading}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg
                ${isFormValid
                  ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-95'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'}
              `}
                        onClick={handleLogin}
            >
                        {mode === 'signup' && 'Register'}
                        {mode === 'forgot' && 'Send Reset Link'}
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Processing...
                            </span>
                        ) : (
                                <>
                                    {mode === 'login' ? 'Sign In' : 'Register'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm">
            {mode === 'login' ? (
              <p>Don't have an account? <button onClick={() => setMode('signup')} className="text-blue-400 font-bold ml-1">Sign Up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setMode('login')} className="text-blue-400 font-bold ml-1">Login</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
