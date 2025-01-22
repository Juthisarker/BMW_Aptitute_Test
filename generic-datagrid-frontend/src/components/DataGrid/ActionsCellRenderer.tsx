import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ICellRendererParams } from 'ag-grid-community';
import { IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

interface ActionsCellRendererProps extends ICellRendererParams {
  onDelete: (id: string) => void;
  viewPath: string;
}

const ActionsCellRenderer: React.FC<ActionsCellRendererProps> = ({ 
  data,
  onDelete,
  viewPath
}) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`${viewPath}/${data.id}`);
  };

  const handleDelete = () => {
    onDelete(data.id);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Tooltip title="View Details">
        <IconButton
          size="small"
          onClick={handleView}
          color="primary"
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          onClick={handleDelete}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};


export default ActionsCellRenderer;