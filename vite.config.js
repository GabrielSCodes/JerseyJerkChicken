import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        accounting: 'accounting.html',
        applicant: 'applicant.html',
        clockIn: 'clockIn.html',
        createOrder: 'createOrder.html',
        home: 'home.html',
        inventory: 'inventory.html',
        job: 'job.html',
        menu: 'menu.html',
        review: 'review.html',
        staff: 'staff.html',
        tables: 'tables.html',
        viewOrders: 'viewOrders.html'
      }
    }
  }
})