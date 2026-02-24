import { useAuthStore } from "@/stores/authStore";

/**
 * 로그인 상태를 확인하는 커스텀 훅
 */
export const useIsLogin = () => {
    return useAuthStore((state) => state.isAuthenticated);
};

/**
 * 현재 로그인된 사용자 정보를 가져오는 커스텀 훅
 */
export const useUser = () => {
    return useAuthStore((state) => state.user);
};

/**
 * 인증 관련 액션들을 가져오는 커스텀 훅
 */
export const useAuth = () => {
    const isLogin = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    return { isLogin, user, login, logout };
};
