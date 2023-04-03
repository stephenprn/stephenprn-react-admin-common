import { MandeError } from 'mande';

export const handleErrors = (error: MandeError) => {
    if (error.response.status === 401) {
        const location = window.location.href.split('/');

        if (location[location.length - 1] !== 'login') {
            window.location.href = '/login';
        }
    }
};
