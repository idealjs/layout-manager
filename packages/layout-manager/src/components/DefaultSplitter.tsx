import useSplitterRef, {
    createShadowStyle,
    createSplitterStyle,
} from "hooks/useSplitterRef";

const CustomSplitter = (props: {
    id: string;
    parentId: string;
    primaryId: string;
    secondaryId: string;
}) => {
    const { id, parentId, primaryId, secondaryId } = props;

    const { ref, shadowRef, splitterStyle, shadowStyle } = useSplitterRef({
        id,
        parentId,
        primaryId,
        secondaryId,
        createSplitterStyle,
        createShadowStyle,
    });

    return (
        <div id={id} ref={ref} style={splitterStyle}>
            <div ref={shadowRef} style={shadowStyle}></div>
        </div>
    );
};

export default CustomSplitter;
