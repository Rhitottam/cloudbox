import { Outlet, useNavigate } from 'react-router-dom';
import { authClient } from '@/lib';
import { Button } from './ui/button';
import { LogOutIcon, UserCircle } from 'lucide-react';

export function Layout() {
  const navigate = useNavigate();
  const { data } = authClient.useSession();
  const isLoggedIn = data?.user?.id != null;
  return (
    <div className="h-screen bg-dark-950 flex flex-col">
      <header className={`border-b border-brand-400`}>
        <div className='p-4 w-full justify-between flex items-center'>
          <h3 className={'text-h3 text-brand-400'}>Cloud Box</h3>
          <nav className="mr-4 text-sm text-muted-foreground flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <UserCircle size={20} className='xs:block hidden' />
                <span className="font-medium text-foreground">{data.user.email}</span>
                <Button variant="default" size="sm" onClick={() => authClient.signOut()}>
                  <span className='xs:block hidden'>Logout</span>
                  <LogOutIcon size={20} className='xs:hidden block' />
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => navigate("/auth")}>
                Login
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className='relative flex-1 w-full overflow-auto p-4'>
        <Outlet />
      </main>
    </div>
  )
}
