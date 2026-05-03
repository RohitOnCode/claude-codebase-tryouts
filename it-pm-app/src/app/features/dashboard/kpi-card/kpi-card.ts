import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  template: `
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div [class]="'w-12 h-12 rounded-xl flex items-center justify-center text-2xl ' + iconBg()">
        {{ icon() }}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-500 font-medium">{{ label() }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ value() }}</p>
        @if (sub()) {
          <p class="text-xs text-gray-400 mt-0.5">{{ sub() }}</p>
        }
      </div>
      @if (trend() !== null) {
        <div [class]="'text-xs font-semibold px-2 py-1 rounded-full ' + (trend()! >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')">
          {{ trend()! >= 0 ? '▲' : '▼' }} {{ Math.abs(trend()!) }}%
        </div>
      }
    </div>
  `
})
export class KpiCard {
  label = input.required<string>();
  value = input.required<string | number>();
  icon = input.required<string>();
  iconBg = input<string>('bg-indigo-50');
  sub = input<string>('');
  trend = input<number | null>(null);
  Math = Math;
}
