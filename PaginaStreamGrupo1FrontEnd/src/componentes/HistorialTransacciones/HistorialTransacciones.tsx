import React, { useState, useEffect } from 'react';
import { fetchTransactionHistory, getTransactionStats } from '../../services/transactionService';
import type { Transaction } from '../../services/transactionService';
import './HistorialTransacciones.css';

interface HistorialTransaccionesProps {
  onClose?: () => void;
}

const HistorialTransacciones: React.FC<HistorialTransaccionesProps> = ({ onClose }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'regalo' | 'compra_monedas'>('all');

  useEffect(() => {
    loadTransactions();
    
    // Escuchar actualizaciones de transacciones
    const handleUpdate = () => {
      loadTransactions();
    };
    
    window.addEventListener('transacciones-actualizadas', handleUpdate);
    
    return () => {
      window.removeEventListener('transacciones-actualizadas', handleUpdate);
    };
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactionHistory();
      setTransactions(data);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.tipo === filter);

  const stats = getTransactionStats(transactions);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (tipo: string) => {
    switch (tipo) {
      case 'regalo':
        return '🎁';
      case 'compra_monedas':
        return '💰';
      case 'puntos':
        return '⭐';
      default:
        return '📝';
    }
  };

  const getTransactionColor = (tipo: string) => {
    switch (tipo) {
      case 'regalo':
        return '#ff4757';
      case 'compra_monedas':
        return '#2ecc71';
      case 'puntos':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="historial-overlay" onClick={onClose}>
      <div className="historial-container" onClick={(e) => e.stopPropagation()}>
        <div className="historial-header">
          <h2>📊 Historial de Transacciones</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose}>✕</button>
          )}
        </div>

        {/* Estadísticas */}
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-label">Monedas Gastadas</span>
            <span className="stat-value">{stats.totalGastoMonedas}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Monedas Compradas</span>
            <span className="stat-value">{stats.totalCompraMonedas}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Regalos Enviados</span>
            <span className="stat-value">{stats.totalRegalos}</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="filter-container">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button 
            className={`filter-btn ${filter === 'regalo' ? 'active' : ''}`}
            onClick={() => setFilter('regalo')}
          >
            Regalos
          </button>
          <button 
            className={`filter-btn ${filter === 'compra_monedas' ? 'active' : ''}`}
            onClick={() => setFilter('compra_monedas')}
          >
            Compras
          </button>
        </div>

        {/* Lista de transacciones */}
        <div className="transactions-list">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando transacciones...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <p>No hay transacciones para mostrar</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="transaction-item"
                style={{ borderLeftColor: getTransactionColor(transaction.tipo) }}
              >
                <div className="transaction-icon">
                  {transaction.gift?.imagenUrl ? (
                    <img src={transaction.gift.imagenUrl} alt={transaction.gift.nombre} />
                  ) : transaction.gift?.emoji ? (
                    <span className="emoji-icon">{transaction.gift.emoji}</span>
                  ) : (
                    <span className="emoji-icon">{getTransactionIcon(transaction.tipo)}</span>
                  )}
                </div>
                
                <div className="transaction-info">
                  <div className="transaction-description">
                    {transaction.descripcion || 'Sin descripción'}
                  </div>
                  {transaction.streamer && (
                    <div className="transaction-streamer">
                      Para: {transaction.streamer.displayName}
                    </div>
                  )}
                  <div className="transaction-date">
                    {formatDate(transaction.createdAt)}
                  </div>
                </div>

                <div className="transaction-amount">
                  <span className={transaction.tipo === 'compra_monedas' ? 'positive' : 'negative'}>
                    {transaction.tipo === 'compra_monedas' ? '+' : '-'}{transaction.monto}
                  </span>
                  <span className="coin-icon">🪙</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialTransacciones;
