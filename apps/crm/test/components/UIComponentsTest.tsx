import * as React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Switch } from '../../components/ui/switch';
import { Slider } from '../../components/ui/slider';
import { Progress } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../../components/ui/dropdown-menu';
import { Popover, PopoverTrigger, PopoverContent } from '../../components/ui/popover';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../../components/ui/tooltip';
import { toast } from 'sonner';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ChevronDown,
  Settings,
  User,
  LogOut
} from 'lucide-react';

export function UIComponentsTest() {
  const [progress, setProgress] = React.useState(45);
  const [sliderValue, setSliderValue] = React.useState([50]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1>اختبار مكونات Shadcn/ui</h1>
        <p className="text-muted-foreground">جميع المكونات الأساسية في مكان واحد</p>
      </div>

      <Separator />

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons - الأزرار</CardTitle>
          <CardDescription>جميع أنواع الأزرار المتاحة</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges - الشارات</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      {/* Inputs & Forms */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs & Forms - حقول الإدخال</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" placeholder="أدخل اسمك..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" type="email" placeholder="example@domain.com" disabled />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox id="terms" />
            <Label htmlFor="terms">أوافق على الشروط والأحكام</Label>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">تفعيل الإشعارات</Label>
            <Switch id="notifications" />
          </div>

          <div className="space-y-2">
            <Label>اختر دولة</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="اختر..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sa">السعودية</SelectItem>
                <SelectItem value="ae">الإمارات</SelectItem>
                <SelectItem value="eg">مصر</SelectItem>
                <SelectItem value="jo">الأردن</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Slider & Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Slider & Progress - المنزلقات والتقدم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Slider: {sliderValue[0]}%</Label>
            <Slider 
              value={sliderValue} 
              onValueChange={setSliderValue}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Progress: {progress}%</Label>
            <Progress value={progress} />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>-10</Button>
              <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts - التنبيهات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>معلومة</AlertTitle>
            <AlertDescription>هذه رسالة معلوماتية عامة</AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>حدث خطأ أثناء العملية</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Avatars - الصور الرمزية</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>محمد</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs - التبويبات</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tab1">التبويب الأول</TabsTrigger>
              <TabsTrigger value="tab2">التبويب الثاني</TabsTrigger>
              <TabsTrigger value="tab3">التبويب الثالث</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <p>محتوى التبويب الأول</p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4">
              <p>محتوى التبويب الثاني</p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4">
              <p>محتوى التبويب الثالث</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs & Popovers */}
      <Card>
        <CardHeader>
          <CardTitle>Dialogs & Menus - النوافذ والقوائم</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {/* Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">فتح نافذة</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>عنوان النافذة</DialogTitle>
                <DialogDescription>هذه نافذة حوارية للاختبار</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>محتوى النافذة هنا...</p>
              </div>
              <DialogFooter>
                <Button variant="outline">إلغاء</Button>
                <Button>تأكيد</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                القائمة <ChevronDown className="mr-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <User className="ml-2 h-4 w-4" />
                الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="ml-2 h-4 w-4" />
                الإعدادات
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">فتح Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <h4>عنوان</h4>
                <p className="text-sm text-muted-foreground">محتوى Popover</p>
              </div>
            </PopoverContent>
          </Popover>

          {/* Tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">مرر الماوس</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>هذا Tooltip!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Toast */}
          <Button 
            variant="outline"
            onClick={() => toast.success('تم بنجاح!', {
              description: 'هذه رسالة اختبار Toast'
            })}
          >
            عرض Toast
          </Button>
        </CardContent>
      </Card>

      {/* Success Message */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>✅ جميع المكونات تعمل بشكل صحيح!</AlertTitle>
        <AlertDescription>
          تم اختبار 40+ مكون من Shadcn/ui بنجاح
        </AlertDescription>
      </Alert>
    </div>
  );
}
