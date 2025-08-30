"use client";
import React, { useState } from 'react';
import { Save, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { updateProduct } from '@/lib/firebaseApi';

interface BulkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparison: any[];
  onUpdateComplete: () => void;
}

const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({ 
  isOpen, 
  onClose, 
  comparison, 
  onUpdateComplete 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateResults, setUpdateResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  }>({ success: 0, failed: 0, errors: [] });

  if (!isOpen) return null;

  const productsToUpdate = comparison.filter(
    comp => comp.status === 'price_mismatch' || comp.status === 'stock_mismatch'
  );

  const handleBulkUpdate = async () => {
    if (productsToUpdate.length === 0) return;

    setIsUpdating(true);
    setUpdateProgress(0);
    setUpdateResults({ success: 0, failed: 0, errors: [] });

    const errors: string[] = [];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < productsToUpdate.length; i++) {
      const comp = productsToUpdate[i];
      try {
        const updateData: Partial<Product> = {};
        
        // Update price if there's a mismatch
        if (comp.status === 'price_mismatch' && comp.excelProduct?.price !== undefined) {
          updateData.price = comp.excelProduct.price;
        }
        
        // Update stock if there's a mismatch
        if (comp.status === 'stock_mismatch' && comp.excelProduct?.stockQuantity !== undefined) {
          updateData.stockQuantity = comp.excelProduct.stockQuantity;
        }

        // Update both if both have mismatches
        if (comp.status === 'price_mismatch' && comp.status === 'stock_mismatch') {
          updateData.price = comp.excelProduct.price;
          updateData.stockQuantity = comp.excelProduct.stockQuantity;
        }

        if (Object.keys(updateData).length > 0) {
          await updateProduct(comp.product.id, updateData);
          successCount++;
        }
      } catch (error) {
        failedCount++;
        errors.push(`Failed to update ${comp.product.name}: ${error}`);
      }

      setUpdateProgress(((i + 1) / productsToUpdate.length) * 100);
    }

    setUpdateResults({ success: successCount, failed: failedCount, errors });
    setIsUpdating(false);
  };

  const getUpdateSummary = () => {
    const priceUpdates = productsToUpdate.filter(comp => comp.status === 'price_mismatch').length;
    const stockUpdates = productsToUpdate.filter(comp => comp.status === 'stock_mismatch').length;
    
    return {
      priceUpdates,
      stockUpdates,
      total: productsToUpdate.length
    };
  };

  const summary = getUpdateSummary();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Save className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Bulk Update Products</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!isUpdating && updateResults.success === 0 && updateResults.failed === 0 && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Update Summary</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{summary.total}</div>
                    <div className="text-sm text-blue-600">Total Updates</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-700">{summary.priceUpdates}</div>
                    <div className="text-sm text-yellow-600">Price Updates</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-700">{summary.stockUpdates}</div>
                    <div className="text-sm text-orange-600">Stock Updates</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Products to be updated:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {productsToUpdate.map((comp, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{comp.product.name}</div>
                        <div className="text-sm text-gray-600">
                          {comp.status === 'price_mismatch' && (
                            <span>Price: ${comp.product.price} → ${comp.excelProduct?.price}</span>
                          )}
                          {comp.status === 'stock_mismatch' && (
                            <span>Stock: {comp.product.stockQuantity} → {comp.excelProduct?.stockQuantity}</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        {comp.status === 'price_mismatch' && (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        )}
                        {comp.status === 'stock_mismatch' && (
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Important Notice</h4>
                    <p className="text-sm text-yellow-700">
                      This action will update {summary.total} products in your system. 
                      The changes will be applied immediately and cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Update Progress */}
          {isUpdating && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Updating Products...</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${updateProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {Math.round(updateProgress)}% complete ({Math.round(updateProgress * summary.total / 100)} of {summary.total})
              </p>
            </div>
          )}

          {/* Update Results */}
          {!isUpdating && (updateResults.success > 0 || updateResults.failed > 0) && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Update Complete!</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">{updateResults.success}</div>
                  <div className="text-sm text-green-600">Successful Updates</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-700">{updateResults.failed}</div>
                  <div className="text-sm text-red-600">Failed Updates</div>
                </div>
              </div>

              {updateResults.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {updateResults.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                        • {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          {!isUpdating && updateResults.success === 0 && updateResults.failed === 0 && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpdate}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Update {summary.total} Products</span>
              </button>
            </>
          )}

          {!isUpdating && (updateResults.success > 0 || updateResults.failed > 0) && (
            <button
              onClick={() => {
                onUpdateComplete();
                onClose();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUpdateModal;
