import { DeleteOutlined as Trash } from '@ant-design/icons';
import { UploadFileProps } from './index';
import classNames from 'classnames';
import { Progress } from 'antd';
interface FileItemProps {
  onClick: (f: UploadFileProps) => void;
  handleDelete: (f: UploadFileProps) => void;
  f: UploadFileProps;
}

const FileItem = (props: FileItemProps) => {
  const { onClick, f, handleDelete } = props;
  const { percent, fileParsing, name, status } = f;
  return (
    <div className="bg-primary/5 hover:bg-primary/20 px-3">
      <div
        className="my-2 flex h-10  cursor-pointer  items-center justify-between  transition "
        onClick={() => {
          f && onClick(f);
        }}
      >
        <span className={classNames('text-ellipsis whitespace-nowrap overflow-hidden ', status == 'error' && 'text-red-500')}>{name}</span>
        {percent && (
          <Trash
            className=" h-4 w-4"
            onClick={(e) => {
              f && handleDelete(f);
            }}
          />
        )}
      </div>
      <Progress percent={percent ?? 0} size="small" />
      {percent == 100 && !fileParsing && <div>解析中。。。。</div>}
    </div>
  );
};
export default FileItem;
