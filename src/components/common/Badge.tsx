import React from 'react';

interface BadgeProps {
  variant: 'status' | 'severity' | 'priority';
  value: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant, value, className = '' }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'status':
        switch (value) {
          case 'open': return 'bg-blue-100 text-blue-800';
          case 'in-progress': return 'bg-purple-100 text-purple-800';
          case 'resolved': return 'bg-green-100 text-green-800';
          case 'closed': return 'bg-gray-100 text-gray-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      case 'severity':
        switch (value) {
          case 'critical': return 'bg-red-100 text-red-800';
          case 'high': return 'bg-orange-100 text-orange-800';
          case 'medium': return 'bg-yellow-100 text-yellow-800';
          case 'low': return 'bg-green-100 text-green-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      case 'priority':
        switch (value) {
          case 'high': return 'bg-red-100 text-red-800';
          case 'medium': return 'bg-yellow-100 text-yellow-800';
          case 'low': return 'bg-green-100 text-green-800';
          default: return 'bg-gray-100 text-gray-800';
        }
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariantClasses()} ${className}`}>
      {value.replace('-', ' ')}
    </span>
  );
};

export default Badge;