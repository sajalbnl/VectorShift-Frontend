// submit.js

import { Play } from 'lucide-react';

export const SubmitButton = () => {
    return (
        <button type="submit" className="submit__button">
            <Play size={13} strokeWidth={2.5} fill="currentColor" />
            Run pipeline
        </button>
    );
}
