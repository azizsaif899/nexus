# TASK-REFACTOR-005: Enhanced error handling for Python backend
import logging
import traceback
from typing import Optional, Dict, Any

class EnhancedErrorHandler:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.error_counts = {}
    
    def handle_error(self, error: Exception, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Handle errors with proper logging and tracking"""
        error_type = type(error).__name__
        error_message = str(error)
        
        # Track error frequency
        self.error_counts[error_type] = self.error_counts.get(error_type, 0) + 1
        
        # Log with context
        self.logger.error(
            f"Error: {error_type} - {error_message}",
            extra={
                'context': context or {},
                'traceback': traceback.format_exc(),
                'error_count': self.error_counts[error_type]
            }
        )
        
        return {
            'success': False,
            'error': error_type,
            'message': error_message,
            'context': context
        }
    
    def get_error_stats(self) -> Dict[str, int]:
        return self.error_counts.copy()

print("✅ Enhanced error handling implemented")