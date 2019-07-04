import { SET_AUTHENTICATED, SET_USER} from "./mutation-type";

export default {
    setAuthenticated({ commit }, isAuthenticated) {
        commit(SET_AUTHENTICATED, {isAuthenticated});
    },
    setUSER({ commit }, user) {
        console.log(user);
        commit(SET_USER, {user})
    },
    createUser: ({ commit }) => {
        commit(SET_AUTHENTICATED, false)
        // commit(SET_USER, null)
    },
}