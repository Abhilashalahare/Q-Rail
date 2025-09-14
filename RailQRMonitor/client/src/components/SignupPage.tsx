import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { useAuth, type UserRole } from '@/contexts/AuthContext'
import { Train, QrCode, Factory, Shield } from 'lucide-react'

interface SignupPageProps {
  onSwitchToLogin: () => void
}

export function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('railway_official')
  const { signup, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive'
      })
      return
    }

    const result = await signup(name, email, password, role)
    
    if (!result.success) {
      toast({
        title: 'Signup Failed',
        description: result.error || 'Failed to create account',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Account Created',
        description: 'Welcome to the Railway QR Monitor system!'
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <QrCode className="h-7 w-7 text-primary-foreground" />
            </div>
            <Train className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground">Join the Railway QR Monitoring System</p>
          </div>
        </div>

        {/* Signup Form */}
        <Card data-testid="card-signup">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to access the monitoring system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@railways.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  data-testid="input-confirm-password"
                />
              </div>

              {/* Role Selection */}
              <div>
                <Label className="text-base">Select Your Role</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(value) => setRole(value as UserRole)}
                  className="mt-2"
                  data-testid="radio-role"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate">
                    <RadioGroupItem value="railway_official" id="railway_official" />
                    <Label htmlFor="railway_official" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Shield className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Railway Official</p>
                        <p className="text-xs text-muted-foreground">Inspector, maintenance, or admin staff</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate">
                    <RadioGroupItem value="vendor" id="vendor" />
                    <Label htmlFor="vendor" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Factory className="h-4 w-4 text-accent" />
                      <div>
                        <p className="font-medium">Vendor</p>
                        <p className="text-xs text-muted-foreground">Manufacturer of railway parts</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
                data-testid="button-signup"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button 
              variant="ghost" 
              className="p-0 h-auto font-normal text-primary hover:text-primary/80"
              onClick={onSwitchToLogin}
              data-testid="button-switch-login"
            >
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage