import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { TextField, SelectField } from '../../components/common/FormField';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { errorMessage } from '../../utils/errorMessage';
import * as adminService from '../../services/adminService';
import { ROLES } from '../../utils/constants';

const empty = { name: '', email: '', password: '', role: ROLES.BUSINESS_ADMIN };

export default function UserFormModal({ open, onClose, user, onSaved }) {
  const toast = useToast();
  const { t } = useLanguage();
  const isEdit = Boolean(user);
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(user ? { name: user.name, email: user.email, password: '', role: user.role } : empty);
    setErrors({});
  }, [open, user]);

  const setField = (name, val) => setValues((prev) => ({ ...prev, [name]: val }));

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = t('users.fullName');
    if (!values.email.trim()) errs.email = t('users.email');
    if (!isEdit && values.password.length < 8) errs.password = t('users.hintMinChars');
    if (isEdit && values.password && values.password.length < 8) errs.password = t('users.hintMinChars');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEdit) {
        const payload = { name: values.name, email: values.email, role: values.role };
        if (values.password) payload.password = values.password;
        await adminService.updateUser(user.id, payload);
        toast.success(t('common.saveChanges'));
      } else {
        await adminService.createUser(values);
        toast.success(t('users.createButton'));
      }
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? t('users.modalTitleEdit') : t('users.modalTitleNew')}>
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField label={t('users.fullName')} required full value={values.name} onChange={(e) => setField('name', e.target.value)} error={errors.name} />
        <TextField label={t('users.email')} type="email" required full value={values.email} onChange={(e) => setField('email', e.target.value)} error={errors.email} />
        <TextField
          label={isEdit ? t('users.newPassword') : t('users.password')}
          type="password"
          required={!isEdit}
          full
          value={values.password}
          onChange={(e) => setField('password', e.target.value)}
          error={errors.password}
          hint={isEdit ? t('users.hintLeaveBlank') : t('users.hintMinChars')}
        />
        <SelectField
          label={t('users.role')}
          full
          value={values.role}
          onChange={(e) => setField('role', e.target.value)}
          options={[
            { value: ROLES.BUSINESS_ADMIN, label: t('users.roleBusinessAdmin') },
            { value: ROLES.SUPER_ADMIN, label: t('users.roleSuperAdmin') },
          ]}
        />
        <div className="form-actions">
          <Button variant="ghost" type="button" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            {isEdit ? t('common.saveChanges') : t('users.createButton')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
