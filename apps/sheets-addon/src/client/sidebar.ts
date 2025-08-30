/**
 * Client-side logic for Google Sheets Sidebar
 * Handles communication with server-side Apps Script functions
 */

interface AnalysisResult {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

class SidebarClient {
  private loadingElement: HTMLElement | null = null;
  private resultElement: HTMLElement | null = null;
  private analyzeButton: HTMLElement | null = null;

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
  }

  private initializeElements(): void {
    this.loadingElement = document.getElementById('loading');
    this.resultElement = document.getElementById('result');
    this.analyzeButton = document.getElementById('analyzeButton');
  }

  private setupEventListeners(): void {
    if (this.analyzeButton) {
      this.analyzeButton.addEventListener('click', () => {
        this.runAnalysis();
      });
    }
  }

  private showLoading(): void {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'block';
      this.loadingElement.textContent = 'جاري التحليل...';
    }
    if (this.resultElement) {
      this.resultElement.style.display = 'none';
    }
    if (this.analyzeButton) {
      (this.analyzeButton as HTMLButtonElement).disabled = true;
    }
  }

  private hideLoading(): void {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
    if (this.analyzeButton) {
      (this.analyzeButton as HTMLButtonElement).disabled = false;
    }
  }

  private showResult(result: AnalysisResult): void {
    if (this.resultElement) {
      this.resultElement.style.display = 'block';
      
      if (result.success) {
        this.resultElement.innerHTML = `
          <div class="success">
            <h3>✅ تم التحليل بنجاح</h3>
            <p>${result.message || 'تم إكمال التحليل'}</p>
            ${result.data ? `<pre>${JSON.stringify(result.data, null, 2)}</pre>` : ''}
          </div>
        `;
      } else {
        this.resultElement.innerHTML = `
          <div class="error">
            <h3>❌ خطأ في التحليل</h3>
            <p>${result.error || 'حدث خطأ غير متوقع'}</p>
          </div>
        `;
      }
    }
  }

  public runAnalysis(): void {
    this.showLoading();

    // Call server-side function using google.script.run
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler((result: AnalysisResult) => {
          console.log('✅ Server response:', result);
          this.hideLoading();
          this.showResult(result);
        })
        .withFailureHandler((error: Error) => {
          console.error('❌ Server error:', error);
          this.hideLoading();
          this.showResult({
            success: false,
            error: `خطأ في الاتصال: ${error.message}`
          });
        })
        .runAnalysis(); // This calls the server-side function
    } else {
      // Fallback for testing outside Google Apps Script environment
      console.log('🧪 Running in test mode');
      setTimeout(() => {
        this.hideLoading();
        this.showResult({
          success: true,
          message: 'تم تشغيل التحليل التجريبي بنجاح',
          data: {
            timestamp: new Date().toISOString(),
            rows: 100,
            columns: 5,
            analysis: 'تحليل تجريبي للبيانات - النظام يعمل بشكل صحيح'
          }
        });
      }, 2000); // Simulate 2 second delay
    }
  }

  // Method to get selected range data
  public getSelectedRange(): void {
    this.showLoading();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler((result: any) => {
          this.hideLoading();
          this.showResult({
            success: true,
            message: 'تم الحصول على البيانات المحددة',
            data: result
          });
        })
        .withFailureHandler((error: Error) => {
          this.hideLoading();
          this.showResult({
            success: false,
            error: `خطأ في الحصول على البيانات: ${error.message}`
          });
        })
        .getSelectedRangeData();
    }
  }

  // Method to analyze specific range
  public analyzeRange(range: string): void {
    this.showLoading();

    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler((result: AnalysisResult) => {
          this.hideLoading();
          this.showResult(result);
        })
        .withFailureHandler((error: Error) => {
          this.hideLoading();
          this.showResult({
            success: false,
            error: `خطأ في تحليل النطاق: ${error.message}`
          });
        })
        .analyzeSpecificRange(range);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SidebarClient();
});

// Export for potential use in other modules
export { SidebarClient };