import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Switch } from '../../components/ui/switch';
import { Slider } from '../../components/ui/slider';

export function ComponentsTestRunner() {
  return (
    <div className="space-y-6">
      <div>
        <h3>اختبار المكونات الأساسية</h3>
        <p className="text-muted-foreground">
          التحقق من عرض المكونات مع الأنماط الصحيحة
        </p>
      </div>

      {/* Buttons */}
      <Card className="p-6">
        <h4 className="mb-4">Buttons</h4>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6">
        <h4 className="mb-4">Badges</h4>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </Card>

      {/* Inputs */}
      <Card className="p-6">
        <h4 className="mb-4">Inputs</h4>
        <div className="space-y-4 max-w-md">
          <Input placeholder="نص عادي" />
          <Input type="password" placeholder="كلمة المرور" />
          <Input disabled placeholder="معطل" />
        </div>
      </Card>

      {/* Form Controls */}
      <Card className="p-6">
        <h4 className="mb-4">Form Controls</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox id="check1" />
            <label htmlFor="check1">Checkbox</label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="switch1" />
            <label htmlFor="switch1">Switch</label>
          </div>
          <div className="space-y-2">
            <label>Slider</label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </div>
      </Card>

      {/* Cards */}
      <Card className="p-6">
        <h4 className="mb-4">Card Variations</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h5>Card 1</h5>
            <p className="text-muted-foreground">Basic card</p>
          </Card>
          <Card className="p-4 border-primary">
            <h5>Card 2</h5>
            <p className="text-muted-foreground">Primary border</p>
          </Card>
          <Card className="p-4 bg-muted">
            <h5>Card 3</h5>
            <p className="text-muted-foreground">Muted background</p>
          </Card>
        </div>
      </Card>

      {/* Glass Effects */}
      <Card className="p-6">
        <h4 className="mb-4">Glass Effects</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-light p-6 rounded-xl">
            <h5>Light Glass</h5>
            <p className="text-muted-foreground">Subtle transparency</p>
          </div>
          <div className="glass-medium p-6 rounded-xl">
            <h5>Medium Glass</h5>
            <p className="text-muted-foreground">Balanced visibility</p>
          </div>
          <div className="glass-intense p-6 rounded-xl">
            <h5>Intense Glass</h5>
            <p className="text-muted-foreground">High visibility</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
