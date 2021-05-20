import close from "./resources/close.svg";

const Close = () => {
    return (
        <img
            src={close}
            className="Close"
            alt="close"
            style={{ width: "100%", height: "100%" }}
            draggable={false}
        />
    );
};

export default Close;
