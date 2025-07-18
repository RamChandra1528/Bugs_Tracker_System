import React, { useState, useEffect } from 'react';
import { Shield, Key, Smartphone, Globe, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { formatDate, formatDateTime } from '../utils/formatters';

const Security = () => {
  const { user, updateUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      const [sessionsResponse, auditResponse] = await Promise.all([
        apiService.getSessions(),
        apiService.getAuditLogs({ limit: 50 })
      ]);

      if (sessionsResponse.success) {
        setSessions(sessionsResponse.sessions);
      }
      if (auditResponse.success) {
        setAuditLogs(auditResponse.logs);
      }
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const response = await apiService.enable2FA();
      if (response.success) {
        setQrCode(response.qrCode);
        setShow2FAModal(true);
      }
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
    }
  };

  const handleVerify2FA = async () => {
    try {
      const response = await apiService.verify2FA(verificationCode);
      if (response.success) {
        updateUser({ twoFactorEnabled: true });
        setShow2FAModal(false);
        setVerificationCode('');
        alert('Two-factor authentication enabled successfully!');
      }
    } catch (error) {
      console.error('Failed to verify 2FA:', error);
      alert('Invalid verification code');
    }
  };

  const handleDisable2FA = async () => {
    const code = prompt('Enter your 2FA code to disable:');
    if (code) {
      try {
        const response = await apiService.disable2FA(code);
        if (response.success) {
          updateUser({ twoFactorEnabled: false });
          alert('Two-factor authentication disabled successfully!');
        }
      } catch (error) {
        console.error('Failed to disable 2FA:', error);
        alert('Invalid verification code');
      }
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to revoke this session?')) {
      try {
        const response = await apiService.revokeSession(sessionId);
        if (response.success) {
          setSessions(sessions.filter((s: any) => s._id !== sessionId));
        }
      } catch (error) {
        console.error('Failed to revoke session:', error);
      }
    }
  };

  const handleRevokeAllSessions = async () => {
    if (window.confirm('Are you sure you want to revoke all other sessions? You will remain logged in on this device.')) {
      try {
        const response = await apiService.revokeAllSessions();
        if (response.success) {
          loadSecurityData();
          alert('All other sessions have been revoked successfully!');
        }
      } catch (error) {
        console.error('Failed to revoke all sessions:', error);
      }
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return '🔐';
      case 'logout': return '🚪';
      case 'create': return '✨';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'assign': return '👤';
      default: return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'text-green-600';
      case 'logout': return 'text-gray-600';
      case 'create': return 'text-blue-600';
      case 'update': return 'text-yellow-600';
      case 'delete': return 'text-red-600';
      case 'assign': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Security Center</h1>
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-green-600" />
          <span className="text-sm text-green-600 font-medium">Account Secured</span>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            {user?.twoFactorEnabled ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Two-Factor Auth</h3>
          <p className={`text-sm mt-1 ${user?.twoFactorEnabled ? 'text-green-600' : 'text-yellow-600'}`}>
            {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{sessions.length}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Last Login</h3>
          <p className="text-sm text-gray-600 mt-1">
            {user?.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
          </p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Key className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Password</h3>
          <p className="text-sm text-green-600 mt-1">Strong</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Security Overview
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Audit Log
          </button>
        </nav>
      </div>

      {/* Security Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
              </div>
              <Badge 
                variant="status" 
                value={user?.twoFactorEnabled ? 'enabled' : 'disabled'} 
              />
            </div>
            <p className="text-gray-600 mb-4">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <div className="flex space-x-3">
              {!user?.twoFactorEnabled ? (
                <button
                  onClick={handleEnable2FA}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enable 2FA
                </button>
              ) : (
                <button
                  onClick={handleDisable2FA}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Disable 2FA
                </button>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Globe className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Session Management</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Monitor and manage your active sessions across different devices and locations.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleRevokeAllSessions}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Revoke All Sessions
              </button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Key className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Password Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-green-900">Password Strength</h4>
                  <p className="text-sm text-green-600">Your password meets security requirements</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Last Changed</h4>
                  <p className="text-sm text-gray-600">30 days ago</p>
                </div>
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Active Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {sessions.map((session: any) => (
            <Card key={session._id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {session.userAgent?.includes('Chrome') ? 'Chrome Browser' :
                       session.userAgent?.includes('Firefox') ? 'Firefox Browser' :
                       session.userAgent?.includes('Safari') ? 'Safari Browser' : 'Unknown Browser'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      IP: {session.ipAddress} • {formatDateTime(session.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.isActive ? 'Active' : 'Inactive'} • Expires {formatDateTime(session.expiresAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {session.isActive && (
                    <Badge variant="status" value="active" />
                  )}
                  <button
                    onClick={() => handleRevokeSession(session._id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {auditLogs.map((log: any) => (
            <Card key={log._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{getActionIcon(log.action)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${getActionColor(log.action)}`}>
                      {log.action.charAt(0).toUpperCase() + log.action.slice(1)} {log.resource}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>IP: {log.ipAddress}</span>
                    <span>Resource ID: {log.resourceId}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 2FA Setup Modal */}
      <Modal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title="Enable Two-Factor Authentication"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-gray-400">QR Code will appear here</div>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
          </div>

          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
              Enter verification code from your app
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShow2FAModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify2FA}
              disabled={verificationCode.length !== 6}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Enable
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Security;