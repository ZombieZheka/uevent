module.exports = {
    /**
     * Creates confirmation code in database and sends it to email
     * @param {String} email email address
     */
    sendConfirmationCode: async (email) => {
        return 'NOT IMPLEMENTED: sendConfirmationCode';
    },
    /**
     * Sends congratulation when user finishes registration
     * @param {String} email email address
     */
    sendCongratulations: async (email) => {
        return 'NOT IMPLEMENTED: sendCongratulations';
    },
    /**
     * Sends letter with link for reset password
     * @param {String} email email address
     * @param {String} link reset link
     */
    sendResetLink: async (email, link) => {
        return 'NOT IMPLEMENTED: sendResetLink';
    }
}
