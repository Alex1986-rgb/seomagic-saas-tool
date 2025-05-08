
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Skeleton,
  Slider,
  Switch,
  Textarea,
  Toggle
} from '@/components/shared/ui';
import { InfoCard, StatusIndicator } from '@/components/shared/data';
import { Layout } from '@/components/shared/layout';

const DesignSystem = () => {
  return (
    <Layout>
      <div className="container py-12">
        <h1 className="heading-1 mb-8">Design System</h1>
        
        <section className="mb-16">
          <h2 className="heading-2 mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="heading-1">Heading 1</h1>
              <p className="text-muted-foreground">font-playfair text-4xl font-bold md:text-5xl lg:text-6xl</p>
            </div>
            <div>
              <h2 className="heading-2">Heading 2</h2>
              <p className="text-muted-foreground">font-playfair text-3xl font-semibold md:text-4xl</p>
            </div>
            <div>
              <h3 className="heading-3">Heading 3</h3>
              <p className="text-muted-foreground">font-playfair text-2xl font-semibold md:text-3xl</p>
            </div>
            <div>
              <p className="body-lg">Large Body Text</p>
              <p className="text-muted-foreground">font-inter text-lg leading-relaxed</p>
            </div>
            <div>
              <p className="body">Body Text</p>
              <p className="text-muted-foreground">font-inter text-base leading-relaxed</p>
            </div>
            <div>
              <p className="body-sm">Small Body Text</p>
              <p className="text-muted-foreground">font-inter text-sm leading-relaxed</p>
            </div>
          </div>
        </section>

        <Separator className="my-8" />
        
        <section className="mb-16">
          <h2 className="heading-2 mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <div className="h-20 w-full rounded-md bg-primary"></div>
              <p className="font-medium">Primary</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-20 w-full rounded-md bg-secondary"></div>
              <p className="font-medium">Secondary</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-20 w-full rounded-md bg-accent"></div>
              <p className="font-medium">Accent</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-20 w-full rounded-md bg-muted"></div>
              <p className="font-medium">Muted</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-20 w-full rounded-md bg-card"></div>
              <p className="font-medium">Card</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-20 w-full rounded-md bg-background"></div>
              <p className="font-medium">Background</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-20 w-full rounded-md bg-foreground"></div>
              <p className="font-medium">Foreground</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-20 w-full rounded-md bg-destructive"></div>
              <p className="font-medium">Destructive</p>
            </div>
          </div>
        </section>

        <Separator className="my-8" />
        
        <section className="mb-16">
          <h2 className="heading-2 mb-6">Buttons</h2>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="glassmorphic">Glassmorphic</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><span>+</span></Button>
            </div>
          </div>
        </section>

        <Separator className="my-8" />
        
        <section className="mb-16">
          <h2 className="heading-2 mb-6">Form Elements</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message here" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="slider">Slider</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>
              <div className="space-y-2">
                <Label>Notification preferences</Label>
                <RadioGroup defaultValue="email">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-option" />
                    <Label htmlFor="email-option">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sms" id="sms-option" />
                    <Label htmlFor="sms-option">SMS</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Toggle</Label>
                <div className="flex space-x-2">
                  <Toggle>Option 1</Toggle>
                  <Toggle>Option 2</Toggle>
                  <Toggle>Option 3</Toggle>
                </div>
              </div>
              <div>
                <Label>Status Indicators</Label>
                <div className="mt-1 flex space-x-2">
                  <span className="status-badge-success">Success</span>
                  <span className="status-badge-warning">Warning</span>
                  <span className="status-badge-error">Error</span>
                  <span className="status-badge-info">Info</span>
                </div>
              </div>
              <div className="pt-4">
                <div className="flex items-center space-x-2">
                  <StatusIndicator status="good" />
                  <span>Good status</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIndicator status="warning" />
                  <span>Warning status</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIndicator status="error" />
                  <span>Error status</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />
        
        <section className="mb-16">
          <h2 className="heading-2 mb-6">Components</h2>
          
          <div className="mb-8">
            <h3 className="heading-3 mb-4">Cards</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card content and details appear here.</p>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Action</Button>
                </CardFooter>
              </Card>
              
              <div className="neo-card p-6">
                <h3 className="text-xl font-semibold mb-2">Neo Card</h3>
                <p className="text-muted-foreground">A modern card with subtle styling.</p>
              </div>
              
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold mb-2">Glass Card</h3>
                <p className="text-muted-foreground">A glassmorphism card with backdrop blur.</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="heading-3 mb-4">Alerts</h3>
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is an informational alert message.
                </AlertDescription>
              </Alert>
              
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  This is an error alert message.
                </AlertDescription>
              </Alert>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="heading-3 mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="heading-3 mb-4">Accordion</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Section 1</AccordionTrigger>
                <AccordionContent>
                  Content for section 1 goes here.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Section 2</AccordionTrigger>
                <AccordionContent>
                  Content for section 2 goes here.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="mb-8">
            <h3 className="heading-3 mb-4">Progress</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <Label className="mb-2 block">25% Complete</Label>
                <Progress value={25} />
              </div>
              <div>
                <Label className="mb-2 block">50% Complete</Label>
                <Progress value={50} />
              </div>
              <div>
                <Label className="mb-2 block">75% Complete</Label>
                <Progress value={75} />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="heading-3 mb-4">Skeletons</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[70%]" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-[60%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Card>
                <CardHeader className="gap-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%]" />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <Separator className="my-8" />

        <section className="mb-16">
          <h2 className="heading-2 mb-6">Card Variants</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              title="Total Users"
              value="2,543"
              change="+12.5%"
              icon={<span>📈</span>}
              isNegative={false}
            />
            <div className="elegant-card p-6">
              <h3 className="text-xl font-semibold mb-2">Elegant Card</h3>
              <p className="text-muted-foreground">A card with elegant styling and subtle border.</p>
            </div>
            <div className="neo-glass p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Glass Panel</h3>
              <p className="text-muted-foreground">A minimalist glass panel with blur effect.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DesignSystem;
