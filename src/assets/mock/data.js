// Mock projects
export const mockProjects = [
  { id: 'P001', name: '蓝山咖啡旗舰店', type: '商业空间', area: '520㎡', style: '现代简约', status: '进行中', designer: '张设计', budget: 680000, materialCost: 320000, startDate: '2026-03-01', deadline: '2026-05-15', progress: 65 },
  { id: 'P002', name: '悦庭日料餐厅', type: '餐饮空间', area: '380㎡', style: '日式侘寂', status: '进行中', designer: '李设计', budget: 450000, materialCost: 210000, startDate: '2026-03-10', deadline: '2026-06-01', progress: 40 },
  { id: 'P003', name: 'MASHUP潮牌集合店', type: '零售空间', area: '280㎡', style: '工业风', status: '待审批', designer: '张设计', budget: 380000, materialCost: 0, startDate: '2026-04-01', deadline: '2026-06-20', progress: 10 },
  { id: 'P004', name: '云栖精品酒店大堂', type: '酒店空间', area: '800㎡', style: '新中式', status: '已完工', designer: '王设计', budget: 1200000, materialCost: 580000, startDate: '2026-01-10', deadline: '2026-03-30', progress: 100 },
  { id: 'P005', name: '光合办公空间', type: '办公空间', area: '1200㎡', style: '轻奢现代', status: '进行中', designer: '李设计', budget: 900000, materialCost: 420000, startDate: '2026-02-20', deadline: '2026-07-01', progress: 35 },
  { id: 'P006', name: '花间堂民宿改造', type: '民宿空间', area: '650㎡', style: '北欧自然', status: '进行中', designer: '张设计', budget: 550000, materialCost: 280000, startDate: '2026-03-15', deadline: '2026-06-10', progress: 55 },
]

// Mock BOM items
export const mockBOMItems = [
  { id: 'B001', projectId: 'P001', name: '意大利灰大理石', spec: '600×1200×20mm', category: '石材', quantity: 120, unit: '㎡', unitPrice: 680, supplier: '石材源供应链', status: '已采购', selectedBy: 'AI推荐' },
  { id: 'B002', projectId: 'P001', name: '微水泥墙面漆', spec: '米白色/哑光', category: '涂料', quantity: 380, unit: '㎡', unitPrice: 120, supplier: '好施建材', status: '已采购', selectedBy: '语意搜材' },
  { id: 'B003', projectId: 'P001', name: '黑胡桃木饰面板', spec: '2400×600×12mm', category: '木材', quantity: 85, unit: '张', unitPrice: 320, supplier: '林丰木业', status: '待采购', selectedBy: '图搜图' },
  { id: 'B004', projectId: 'P001', name: '黄铜定制踢脚线', spec: 'H=80mm', category: '金属', quantity: 200, unit: 'm', unitPrice: 85, supplier: '新铜装饰', status: '打样中', selectedBy: 'AI平替' },
  { id: 'B005', projectId: 'P001', name: '艺术玻璃隔断', spec: '定制渐变/10mm', category: '玻璃', quantity: 45, unit: '㎡', unitPrice: 450, supplier: '晶艺玻璃', status: '待确认', selectedBy: '手动选择' },
  { id: 'B006', projectId: 'P001', name: '环氧地坪漆', spec: '深灰色/自流平', category: '涂料', quantity: 280, unit: '㎡', unitPrice: 65, supplier: '好施建材', status: '已到货', selectedBy: 'AI推荐' },
  { id: 'B007', projectId: 'P001', name: '定制灯具-主灯', spec: 'D=1200mm/LED', category: '灯具', quantity: 8, unit: '套', unitPrice: 2800, supplier: '光语照明', status: '已采购', selectedBy: '语意搜材' },
  { id: 'B008', projectId: 'P001', name: '岩板餐台面板', spec: '1600×800×20mm', category: '石材', quantity: 12, unit: '块', unitPrice: 960, supplier: '石材源供应链', status: '待采购', selectedBy: 'AI平替' },
]

// Mock suppliers
export const mockSuppliers = [
  { id: 'S001', name: '石材源供应链', contact: '刘经理', phone: '138****5521', category: '石材/岩板', region: '福建水头', rating: 4.8, orders: 45, onTime: '96%', quality: '优', status: '合格' },
  { id: 'S002', name: '好施建材', contact: '陈总', phone: '139****3342', category: '涂料/辅材', region: '广东佛山', rating: 4.5, orders: 78, onTime: '92%', quality: '良', status: '合格' },
  { id: 'S003', name: '林丰木业', contact: '林工', phone: '135****7788', category: '木材/饰面', region: '浙江南浔', rating: 4.6, orders: 32, onTime: '94%', quality: '优', status: '合格' },
  { id: 'S004', name: '新铜装饰', contact: '周经理', phone: '186****1122', category: '金属装饰', region: '广东深圳', rating: 4.2, orders: 15, onTime: '88%', quality: '良', status: '合格' },
  { id: 'S005', name: '晶艺玻璃', contact: '张总', phone: '158****9933', category: '玻璃/镜面', region: '江苏苏州', rating: 4.7, orders: 28, onTime: '95%', quality: '优', status: '合格' },
  { id: 'S006', name: '光语照明', contact: '李工', phone: '137****4456', category: '灯具/照明', region: '广东中山', rating: 4.4, orders: 56, onTime: '90%', quality: '良', status: '合格' },
  { id: 'S007', name: '绿筑新材料', contact: '王经理', phone: '150****6677', category: '环保材料', region: '上海', rating: 4.9, orders: 12, onTime: '98%', quality: '优', status: '合格' },
]

// Mock purchase orders
export const mockOrders = [
  { id: 'PO001', projectId: 'P001', supplier: '石材源供应链', items: 2, totalAmount: 102000, status: '已发货', createDate: '2026-03-15', deliveryDate: '2026-03-28', payStatus: '预付60%' },
  { id: 'PO002', projectId: 'P001', supplier: '好施建材', items: 1, totalAmount: 45600, status: '已到货', createDate: '2026-03-18', deliveryDate: '2026-03-22', payStatus: '已结清' },
  { id: 'PO003', projectId: 'P001', supplier: '光语照明', items: 1, totalAmount: 22400, status: '生产中', createDate: '2026-03-25', deliveryDate: '2026-04-15', payStatus: '预付30%' },
  { id: 'PO004', projectId: 'P001', supplier: '新铜装饰', items: 1, totalAmount: 17000, status: '打样中', createDate: '2026-04-01', deliveryDate: '-', payStatus: '未付款' },
  { id: 'PO005', projectId: 'P002', supplier: '林丰木业', items: 3, totalAmount: 86000, status: '已确认', createDate: '2026-04-02', deliveryDate: '2026-04-20', payStatus: '预付30%' },
  { id: 'PO006', projectId: 'P002', supplier: '绿筑新材料', items: 2, totalAmount: 54000, status: '待审批', createDate: '2026-04-05', deliveryDate: '-', payStatus: '未付款' },
]

// Mock contracts
export const mockContracts = [
  { id: 'CT001', orderId: 'PO001', supplier: '石材源供应链', amount: 102000, signDate: '2026-03-16', status: '已签署', payTerms: '30-60-10', approver: '公司老板' },
  { id: 'CT002', orderId: 'PO002', supplier: '好施建材', amount: 45600, signDate: '2026-03-19', status: '已签署', payTerms: '50-50', approver: '采购经理' },
  { id: 'CT003', orderId: 'PO003', supplier: '光语照明', amount: 22400, signDate: '2026-03-26', status: '已签署', payTerms: '30-70', approver: '采购经理' },
  { id: 'CT004', orderId: 'PO005', supplier: '林丰木业', amount: 86000, signDate: '2026-04-03', status: '履行中', payTerms: '30-50-20', approver: '公司老板' },
  { id: 'CT005', orderId: 'PO006', supplier: '绿筑新材料', amount: 54000, signDate: '-', status: '待审批', payTerms: '40-60', approver: '-' },
]

// Mock sampling
export const mockSampling = [
  { id: 'SM001', projectId: 'P001', material: '黄铜定制踢脚线', supplier: '新铜装饰', status: '封样中', requestDate: '2026-04-01', expectDate: '2026-04-10', designer: '张设计', remark: '需确认色号与现场灯光搭配效果' },
  { id: 'SM002', projectId: 'P001', material: '艺术玻璃隔断', supplier: '晶艺玻璃', status: '待提交', requestDate: '2026-04-05', expectDate: '2026-04-15', designer: '张设计', remark: '定制渐变工艺，需先看小样' },
  { id: 'SM003', projectId: 'P003', material: '锈蚀钢板', supplier: '新铜装饰', status: '已通过', requestDate: '2026-03-20', expectDate: '2026-03-28', designer: '张设计', remark: '锈蚀效果已确认' },
]

// Mock warehouse inventory
export const mockInventory = [
  { id: 'W001', name: '意大利灰大理石', spec: '600×1200×20mm', stock: 85, unit: '㎡', location: 'A区-01', safetyStock: 50, status: '正常', project: 'P001' },
  { id: 'W002', name: '环氧地坪漆', spec: '深灰色/自流平', stock: 0, unit: '桶', location: 'B区-03', safetyStock: 10, status: '已出库', project: 'P001' },
  { id: 'W003', name: '微水泥墙面漆', spec: '米白色/哑光', stock: 120, unit: 'L', location: 'B区-01', safetyStock: 30, status: '正常', project: 'P001' },
  { id: 'W004', name: '黑胡桃木饰面板', spec: '2400×600×12mm', stock: 0, unit: '张', location: '-', safetyStock: 20, status: '未入库', project: 'P001' },
  { id: 'W005', name: '定制灯具-主灯', spec: 'D=1200mm/LED', stock: 0, unit: '套', location: '-', safetyStock: 0, status: '生产中', project: 'P001' },
  { id: 'W006', name: '艺术玻璃隔断', spec: '定制渐变/10mm', stock: 0, unit: '㎡', location: '-', safetyStock: 0, status: '待确认', project: 'P001' },
]

// Mock finance records
export const mockFinanceRecords = [
  { id: 'F001', projectId: 'P001', type: '预付款', supplier: '石材源供应链', amount: 61200, date: '2026-03-17', status: '已支付', invoice: '已收票' },
  { id: 'F002', projectId: 'P001', type: '尾款', supplier: '好施建材', amount: 22800, date: '2026-03-25', status: '已支付', invoice: '已收票' },
  { id: 'F003', projectId: 'P001', type: '预付款', supplier: '光语照明', amount: 6720, date: '2026-03-27', status: '已支付', invoice: '未收票' },
  { id: 'F004', projectId: 'P002', type: '预付款', supplier: '林丰木业', amount: 25800, date: '2026-04-04', status: '已支付', invoice: '未收票' },
  { id: 'F005', projectId: 'P001', type: '材料成本', supplier: '-', amount: 320000, date: '-', status: '进行中', invoice: '-' },
]

// Mock material database for AI search
export const mockMaterialDB = [
  { id: 'M001', name: '卡拉拉白大理石', category: '石材', style: ['现代简约','轻奢','欧式'], color: '白色/灰纹', texture: '抛光/哑光', priceRange: [400, 800], unit: '㎡', fireproof: 'A1级', wearResist: '高', envLevel: 'E0', image: 'https://picsum.photos/seed/marble1/300/300', tags: ['白色','大理石','意大利','高档'] },
  { id: 'M002', name: '鱼肚灰大理石', category: '石材', style: ['现代简约','新中式'], color: '浅灰/白纹', texture: '哑光/磨砂', priceRange: [350, 650], unit: '㎡', fireproof: 'A1级', wearResist: '高', envLevel: 'E0', image: 'https://picsum.photos/seed/marble2/300/300', tags: ['灰色','大理石','百搭'] },
  { id: 'M003', name: '微水泥', category: '涂料', style: ['现代简约','侘寂','工业风','北欧'], color: '多色可选', texture: '哑光/微颗粒', priceRange: [80, 200], unit: '㎡', fireproof: 'B1级', wearResist: '中', envLevel: 'E0', image: 'https://picsum.photos/seed/microcement/300/300', tags: ['微水泥','无缝','侘寂','奶油风'] },
  { id: 'M004', name: '黑胡桃木饰面板', category: '木材', style: ['新中式','北欧','轻奢'], color: '深棕/巧克力色', texture: '木纹/开放漆', priceRange: [250, 400], unit: '㎡', fireproof: 'B2级', wearResist: '中', envLevel: 'E0', image: 'https://picsum.photos/seed/walnut/300/300', tags: ['黑胡桃','木饰面','高档','温暖'] },
  { id: 'M005', name: '水磨石', category: '石材', style: ['工业风','复古','商业空间'], color: '多色可选', texture: '磨砂/抛光', priceRange: [150, 350], unit: '㎡', fireproof: 'A1级', wearResist: '高', envLevel: 'E0', image: 'https://picsum.photos/seed/terrazzo/300/300', tags: ['水磨石','工业风','复古','耐磨'] },
  { id: 'M006', name: '锈蚀钢板', category: '金属', style: ['工业风','户外'], color: '铁锈红/棕', texture: '自然锈蚀', priceRange: [200, 400], unit: '㎡', fireproof: 'A级', wearResist: '高', envLevel: 'E0', image: 'https://picsum.photos/seed/corten/300/300', tags: ['锈蚀钢','耐候钢','工业风'] },
  { id: 'M007', name: '哑光黄铜', category: '金属', style: ['轻奢','新中式','ArtDeco'], color: '古铜色/金色', texture: '拉丝/哑光', priceRange: [300, 600], unit: '㎡', fireproof: 'A级', wearResist: '高', envLevel: 'E0', image: 'https://picsum.photos/seed/brass/300/300', tags: ['黄铜','轻奢','金色','高档'] },
  { id: 'M008', name: '艺术玻璃', category: '玻璃', style: ['现代简约','轻奢'], color: '多色可选', texture: '磨砂/渐变/夹胶', priceRange: [300, 800], unit: '㎡', fireproof: 'B1级', wearResist: '中', envLevel: 'E0', image: 'https://picsum.photos/seed/artglass/300/300', tags: ['艺术玻璃','渐变','隔断','透光'] },
  { id: 'M009', name: '夯土墙', category: '涂料', style: ['侘寂','自然风','民宿'], color: '土黄/暖灰', texture: '粗糙/肌理', priceRange: [100, 250], unit: '㎡', fireproof: 'B1级', wearResist: '中', envLevel: 'E0', image: 'https://picsum.photos/seed/rammedearth/300/300', tags: ['夯土','侘寂','肌理','自然'] },
  { id: 'M010', name: '木纹砖', category: '陶瓷', style: ['北欧','日式','现代简约'], color: '木色多选', texture: '哑光/木纹', priceRange: [60, 180], unit: '㎡', fireproof: 'A1级', wearResist: '高', envLevel: 'E0', image: 'https://picsum.photos/seed/woodtile/300/300', tags: ['木纹砖','瓷砖','仿木','耐磨'] },
  { id: 'M011', name: '清水混凝土', category: '涂料', style: ['工业风','极简','日式'], color: '灰白/暖灰', texture: '光滑/模板纹', priceRange: [80, 180], unit: '㎡', fireproof: 'A1级', wearResist: '高', envLevel: 'E0', image: 'https://picsum.photos/seed/concrete/300/300', tags: ['清水混凝土','极简','工业风','模板'] },
  { id: 'M012', name: '岩板', category: '石材', style: ['现代简约','轻奢','商业空间'], color: '多色可选', texture: '哑光/亮光', priceRange: [200, 600], unit: '㎡', fireproof: 'A1级', wearResist: '极高', envLevel: 'E0', image: 'https://picsum.photos/seed/sintered/300/300', tags: ['岩板','大板','耐磨','防火'] },
]

// Dashboard stats
export const mockDashboardStats = {
  totalProjects: 6, activeProjects: 4, completedProjects: 1, pendingApproval: 1,
  totalBudget: 4160000, totalMaterialCost: 1810000, costSavingRate: 12.5,
  pendingOrders: 6, inProduction: 2, shipped: 1, samplingCount: 3,
  aiSelectionCount: 156, aiAlternativeSaving: 285000, avgDeliveryDays: 18,
}
