module.exports = {
    validateInput: (message) => {
        if (!message || typeof message !== 'string') {
            return { valid: false, message: 'Message must be a string' };
        }

        const trimmed = message.trim();
        if (trimmed.length === 0) {
            return { valid: false, message: 'Message cannot be empty' };
        }

        const wordCount = trimmed.split(/\s+/).length;
        if (wordCount > 150) {
            return { valid: false, message: 'Maximum 2000 words allowed' };
        }

        return { valid: true };
    }
};