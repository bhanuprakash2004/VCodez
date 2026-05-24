import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-awareness',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './awareness.html',
  styleUrls: ['./awareness.css']
})
export class AwarenessComponent {

  selectedUsage: any = null;

  /* SMART CONSERVATION */

  conservation = [

    {
      icon: '🌧️',
      title: 'Rainwater Harvesting',
      desc: 'Collect and store rainwater to recharge groundwater and reduce water shortage.',
      link: 'https://en.wikipedia.org/wiki/Rainwater_harvesting'
    },

    {
      icon: '🚿',
      title: 'Reduce Daily Waste',
      desc: 'Close taps, fix leakages, and avoid unnecessary water flow at home.',
      link: 'https://www.wikihow.com/Save-Water'
    },

    {
      icon: '🌱',
      title: 'Smart Farming',
      desc: 'Use drip irrigation, sprinklers, and planned watering to save water in agriculture.',
      link: 'https://www.fao.org/land-water/water/water-management/en/'
    },

    {
      icon: '🏭',
      title: 'Reuse Treated Water',
      desc: 'Use treated wastewater for gardening, cleaning, cooling, and non-drinking purposes.',
      link: 'https://3daqua.in/blog/how-to-reuse-treated-sewage-water-effectively-in-india/'
    }

  ];

  /* WATER QUALITY */

  usage = [

    {
      icon: '✅',
      type: 'Drinking Water',
      range: 'pH: 6.5 - 8.5 | Turbidity: 0 - 5 NTU',
      details:
        'This water is suitable for drinking and cooking. Temperature can be cold, moderate, or warm, but pH and turbidity must remain safe.'
    },

    {
      icon: '🚜',
      type: 'Agricultural Water',
      range: 'pH: 6.0 - 8.5 | Turbidity: 10 - 50 NTU',
      details:
        'This water can be used for farming, irrigation, and gardening purposes.'
    },

    {
      icon: '🏭',
      type: 'Industrial Water',
      range: 'Turbidity: 10 - 50 NTU',
      details:
        'This water can be reused for industrial cooling systems, washing, and non-drinking operations.'
    },

    {
      icon: '⚠️',
      type: 'Unsafe Water',
      range: 'Very low/high pH or turbidity above safe limits',
      details:
        'This water should not be used directly. It requires filtration and treatment before usage.'
    }

  ];

  /* CITIZEN ACTIONS */

  actions = [

    'Save water at home and public places',

    'Support rainwater harvesting',

    'Reuse water wherever possible',

    'Avoid polluting rivers, lakes, and ponds',

    'Report water leakage and wastage'

  ];

  /* OPEN POPUP */

  openUsage(item: any) {

    this.selectedUsage = item;

  }

  /* CLOSE POPUP */

  closeUsage() {

    this.selectedUsage = null;

  }

}
