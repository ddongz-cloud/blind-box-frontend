// 订单状态常量
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

// 订单状态显示文本
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '待支付',
  [ORDER_STATUS.PAID]: '已支付',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消'
}

// 订单状态颜色
export const ORDER_STATUS_COLOR = {
  [ORDER_STATUS.PENDING]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  [ORDER_STATUS.PAID]: 'text-blue-600 bg-blue-50 border-blue-200',
  [ORDER_STATUS.COMPLETED]: 'text-green-600 bg-green-50 border-green-200',
  [ORDER_STATUS.CANCELLED]: 'text-gray-600 bg-gray-50 border-gray-200'
}

// 支付方式常量
export const PAYMENT_METHOD = {
  POINTS: 'points'
}

// 支付方式显示文本
export const PAYMENT_METHOD_TEXT = {
  [PAYMENT_METHOD.POINTS]: '金币支付'
}
