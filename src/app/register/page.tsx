import Link from 'next/link'
import { RegisterForm } from '@/components/RegisterForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join Studio Finder</CardTitle>
          <CardDescription>
            Create your account to connect with artists and producers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 