import AuthForm from "@/components/admin/auth/AuthForm";

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#1a1a1a_0%,#2d1616_25%,#4a1c1c_50%,#a31a23_75%,#1f1f1f_100%)] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl p-px">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-red-700 via-red-600 to-black" />
          <div className="relative rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
            <div className="mb-8 flex justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br shadow-xl">
                <img src="/images/auth/logo.png" alt="Logo" className="h-20 w-28" />
              </div>
            </div>

            <div className="mb-2 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
            </div>
            <p className="mb-8 text-center text-sm leading-relaxed text-gray-600">
              Secure access to your admin dashboard. Enter your credentials to continue. 🚀
            </p>

            <AuthForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white">
          © {new Date().getFullYear()} {process.env.APP_NAME}. All rights reserved!
        </p>
      </div>
    </div>
  );
}
