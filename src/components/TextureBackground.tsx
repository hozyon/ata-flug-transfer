const TextureBackground = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.3]" aria-hidden="true">
            <div className="absolute inset-0 bg-white"></div>
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, #e2e8f0 0px, #e2e8f0 1px, transparent 1px, transparent 10px)',
                    backgroundSize: '100% 100%'
                }}
            ></div>
        </div>
    );
};

export default TextureBackground;
