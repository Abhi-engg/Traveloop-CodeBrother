import { useForm } from 'react-hook-form'
import { apiClient } from '../api/client'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm()

  const onSubmit = async (values) => {
    const response = await apiClient.post('/token/pair', {
      username: values.username,
      password: values.password,
    })
    login(response.data.access)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to sync your trips.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium uppercase text-slate-500">
              Username
            </label>
            <input
              className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium uppercase text-slate-500">
              Password
            </label>
            <input
              type="password"
              className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
