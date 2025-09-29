
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './common/Modal';

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Mock login logic
        if (email === 'user@example.com' && password === 'password') {
            onLoginSuccess();
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <Modal title={t('login', 'Login')} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        {t('email', 'Email')}
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        {t('password', 'Password')}
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-eco-blue hover:bg-eco-blue-light text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {t('sign_in', 'Sign In')}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-block align-baseline font-bold text-sm text-eco-blue hover:text-eco-blue-light"
                    >
                        {t('cancel', 'Cancel')}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LoginModal;
