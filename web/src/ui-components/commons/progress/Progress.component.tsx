import './progress.scss';
export interface ProgressPropType {
    progress: number | string;
    color?: string;
    textPlacement?: 'center' | 'left' | 'right' | 'off-left' | 'off-right';
}
const Progress = ({ progress, color }: ProgressPropType) => {
    return (
        <div className="simple-progress-xx" style={{ border: `1px solid ${color ?? '#295EA7'}` }}>
            <span style={{
                width: typeof progress === 'number' ?
                `${progress > 100 ? progress % 100 : progress}%` : progress,
                backgroundColor: color ?? '#295EA7' }}>
                <span style={{ fontSize: 10, width: 'auto' }}>{ progress }%</span>
            </span>
        </div>
    );
};
export default Progress;
