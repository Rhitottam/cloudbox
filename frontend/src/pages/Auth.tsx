import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginFormData, loginFormSchema, SignupFormData, signupFormSchema } from "@/schemas";
import { authClient } from "@/lib";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


function LoginForm() {

    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    async function onSubmit(values: LoginFormData) {
        await authClient.signIn.email({
            ...values,
            callbackURL: "/",
        }, {
            onError: (error) => {
                toast.error(error.error.message || "Failed to login");
            }
        });
    }


    const { isSubmitting } = form.formState;

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <PasswordInput placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button isLoading={isSubmitting} type="submit">Login</Button>
        </form>
    </Form>
}

function SignupForm() {
    let navigate = useNavigate();
    const form = useForm({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    async function onSubmit(values: SignupFormData) {
        await authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: values.name,
            callbackURL: "/",
        }, {
            onError: (error) => {
                toast.error(error.error.message || "Failed to signup");
            },
            onSuccess: () => {
                navigate("/", { replace: true });
                toast.success("Signup successful!");
            },

        });
    }

    const { isSubmitting } = form.formState;

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <PasswordInput placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                        <PasswordInput placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <Button isLoading={isSubmitting} type="submit">Signup</Button>
        </form>
    </Form>
}



export function Auth() {
    return (
        <div className="flex flex-col items-center bg-dark-950 h-full">
            <Card className="xs:w-[400px] w-[350px] max-w-sm">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Welcome to Cloud Box</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login">
                        <div role="tablist" className="flex justify-center items-center">
                            <TabsList className="w-auto">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Signup</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="login">
                            <LoginForm />
                        </TabsContent>
                        <TabsContent value="signup">
                            <SignupForm />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}