import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GraduationCap } from 'lucide-react';

interface LoginPageProps {
  users: User[];
  onLogin: (user: User) => void;
}

export default function LoginPage({ users, onLogin }: LoginPageProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const handleLogin = () => {
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle>Quiz Management Platform</CardTitle>
          <CardDescription>Select a user to login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Select User</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleLogin} 
            disabled={!selectedUserId}
            className="w-full"
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
