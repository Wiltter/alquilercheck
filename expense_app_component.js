import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, DollarSign, TrendingUp, TrendingDown, Calendar, Trash2, Edit2, Save, X, RefreshCw } from 'lucide-react';

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [userName, setUserName] = useState('Fiorella');
  const [isEditingName, setIsEditingName] = useState(false);

  const categories = {
    income: ['Sueldo', 'Trabajos Extras', 'Regalos', 'Devoluciones', 'Papas', 'Otros Ingresos'],
    expense: ['Transporte', 'Alimentación', 'Servicios', 'Gasto Innecesario', 'Productos de Limpieza', 'Productos de Cuidado Personal', 'Fotocopias', 'Casa', 'Otros Gastos']
  };

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedTransactions = localStorage.getItem('expense-tracker-transactions');
    const savedUserName = localStorage.getItem('expense-tracker-username');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedUserName) {
      setUserName(savedUserName);
    }
  }, []);

  // Guardar transacciones en localStorage
  useEffect(() => {
    localStorage.setItem('expense-tracker-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Guardar nombre de usuario
  useEffect(() => {
    localStorage.setItem('expense-tracker-username', userName);
  }, [userName]);

  const addTransaction = () => {
    if (!description || !amount || !category) return;
    
    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toLocaleDateString('es-AR')
    };
    
    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const startEditing = (transaction) => {
    setEditingId(transaction.id);
    setEditValues({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category
    });
  };

  const saveEdit = (id) => {
    setTransactions(transactions.map(t => 
      t.id === id 
        ? { ...t, ...editValues, amount: parseFloat(editValues.amount) }
        : t
    ));
    setEditingId(null);
    setEditValues({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const resetAllData = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
      setTransactions([]);
      setUserName('Tu nombre');
      localStorage.removeItem('expense-tracker-transactions');
      localStorage.removeItem('expense-tracker-username');
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Frases motivacionales según el balance
  const getMotivationalQuote = () => {
    if (balance > 0) {
      const positiveQuotes = [
        `¡Excelente ${userName}! 💪 Estás ahorrando y construyendo tu futuro financiero.`,
        `¡Vas muy bien! 🌟 Tus ingresos superan tus gastos, sigue así.`,
        `¡Increíble gestión! 💚 Estás en el camino correcto hacia la estabilidad financiera.`,
        `¡Felicitaciones! 🎉 Tu disciplina financiera está dando frutos.`,
        `¡Eres una crack! ✨ Mantener este balance positivo te acerca a tus metas.`
      ];
      return positiveQuotes[Math.floor(balance / 1000) % positiveQuotes.length];
    } else {
      const improvementQuotes = [
        `${userName}, es momento de revisar tus gastos 💡 Pequeños cambios hacen grandes diferencias.`,
        `No te preocupes 🤗 Identifica esos 'gastos innecesarios' y verás la mejora.`,
        `¡Tranquila! 💪 Cada mes es una nueva oportunidad de mejorar tu balance.`,
        `Revisa tus categorías 📊 ¿Hay algo que puedas reducir este mes?`,
        `¡Tú puedes! 🌟 Enfócate en lo esencial y verás resultados pronto.`
      ];
      return improvementQuotes[Math.abs(Math.floor(balance / 1000)) % improvementQuotes.length];
    }
  };

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* Header con nombre editable */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <DollarSign className="mr-3 text-blue-600" size={32} />
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    onKeyPress={(e) => e.key === 'Enter' && setIsEditingName(false)}
                    className="text-3xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                    autoFocus
                  />
                </div>
              ) : (
                <h1 
                  className="text-3xl font-bold text-gray-800 cursor-pointer hover:text-blue-600"
                  onClick={() => setIsEditingName(true)}
                  title="Haz clic para editar tu nombre"
                >
                  Control de Gastos de {userName}
                </h1>
              )}
              <p className="text-gray-600">Gestiona tus ingresos y gastos personales de forma inteligente</p>
            </div>
          </div>
          <button
            onClick={resetAllData}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            title="Borrar todos los datos"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>

        {/* Resumen Financiero */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Ingresos</p>
                <p className="text-2xl font-bold text-green-700">${totalIncome.toLocaleString('es-AR')}</p>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Gastos</p>
                <p className="text-2xl font-bold text-red-700">${totalExpenses.toLocaleString('es-AR')}</p>
              </div>
              <TrendingDown className="text-red-500" size={24} />
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border-l-4 ${balance >= 0 ? 'bg-blue-50 border-blue-500' : 'bg-orange-50 border-orange-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                  ${balance.toLocaleString('es-AR')}
                </p>
              </div>
              <DollarSign className={balance >= 0 ? 'text-blue-500' : 'text-orange-500'} size={24} />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Transacciones</p>
                <p className="text-2xl font-bold text-gray-700">{transactions.length}</p>
              </div>
              <Calendar className="text-gray-500" size={24} />
            </div>
          </div>
        </div>

        {/* Frase motivacional */}
        <div className={`p-4 rounded-lg mb-6 text-center ${balance >= 0 ? 'bg-green-100 border border-green-300' : 'bg-yellow-100 border border-yellow-300'}`}>
          <p className={`text-lg font-medium ${balance >= 0 ? 'text-green-800' : 'text-yellow-800'}`}>
            {getMotivationalQuote()}
          </p>
        </div>

        {/* Formulario para agregar transacciones */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Nueva Transacción</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select 
                value={type} 
                onChange={(e) => {
                  setType(e.target.value);
                  setCategory('');
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                {categories[type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Almuerzo, compras super, transporte..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={addTransaction}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
              >
                {type === 'income' ? <PlusCircle size={20} className="mr-2" /> : <MinusCircle size={20} className="mr-2" />}
                Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Análisis por categorías */}
        {Object.keys(expensesByCategory).length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Gastos por Categoría</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="bg-white p-3 rounded-lg border">
                  <p className="text-sm text-gray-600 font-medium">{category}</p>
                  <p className="text-lg font-bold text-red-600">${amount.toLocaleString('es-AR')}</p>
                  <p className="text-xs text-gray-500">
                    {((amount / totalExpenses) * 100).toFixed(1)}% del total
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de transacciones */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Historial de Transacciones</h2>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 text-lg">¡Comienza agregando tu primera transacción!</p>
                <p className="text-gray-400 text-sm">Usa el formulario de arriba para registrar tus ingresos y gastos</p>
              </div>
            ) : (
              transactions.map(transaction => (
                <div key={transaction.id} className={`p-4 rounded-lg border-l-4 ${
                  transaction.type === 'income' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                }`}>
                  {editingId === transaction.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                      <input
                        type="text"
                        value={editValues.description}
                        onChange={(e) => setEditValues({...editValues, description: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={editValues.category}
                        onChange={(e) => setEditValues({...editValues, category: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      >
                        {categories[transaction.type].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={editValues.amount}
                        onChange={(e) => setEditValues({...editValues, amount: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(transaction.id)} className="text-green-600 hover:text-green-700">
                          <Save size={18} />
                        </button>
                        <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-700">
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-lg ${
                            transaction.type === 'income' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('es-AR')}
                          </span>
                          <span className="text-gray-700 font-medium">{transaction.description}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm bg-gray-200 px-2 py-1 rounded">{transaction.category}</span>
                          <span className="text-sm text-gray-500">{transaction.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(transaction)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            💰 Expense Tracker | Controla tus finanzas de forma inteligente
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;