import { useEffect, useState } from "react";
import { Edit2, Eye, EyeOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "editor",
  isActive: true,
};

function EditUserButton({ onClick, fullWidth = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={fullWidth
        ? "inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-[#D0D5DD] px-3 py-2 text-sm font-medium text-[#4F7B44]"
        : "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-[#4F7B44]"}
      style={fullWidth ? undefined : { background: "none", border: "none", cursor: "pointer" }}
    >
      <Edit2 size={14} /> Edit
    </button>
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/auth/users/${userToDelete._id}`);
      toast.success("User deleted permanently.");
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      if (editingUserId === userToDelete._id) cancelEdit();
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete user.");
    } finally {
      setDeleting(false);
    }
  }

  async function loadUsers() {
    try {
      setLoading(true);
      const response = await api.get("/auth/users");
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (editingUserId) {
        await api.put(`/auth/users/${editingUserId}`, form);
        toast.success("User updated.");
      } else {
        await api.post("/auth/register", form);
        toast.success("User created.");
      }

      setForm(EMPTY_FORM);
      setEditingUserId(null);
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || `Could not ${editingUserId ? "update" : "create"} user.`);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(user) {
    setEditingUserId(user._id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingUserId(null);
    setForm(EMPTY_FORM);
  }

  return (
    <>
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete user?"
        description={`This will permanently delete ${userToDelete?.name} and remove their access to the CMS. This action cannot be undone.`}
        confirmLabel="Delete user"
        cancelLabel="Cancel"
        busy={deleting}
        onCancel={() => {
          if (!deleting) {
            setShowDeleteConfirm(false);
            setUserToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
      />

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
      <section className="rounded-2xl border border-[#E5E7EB] bg-white lg:sticky lg:top-6">
        <div className="border-b border-[#E5E7EB] px-4 py-4 sm:px-5">
          <h2 className="text-lg font-bold text-[#101828]">
            {editingUserId ? "Edit user" : "Create user"}
          </h2>
          <p className="text-sm text-[#667085]">
            {editingUserId
              ? "Update user details or reset password."
              : "Admins can create editor and admin accounts for the CMS."}
          </p>
        </div>

        <form className="space-y-5 px-4 py-5 sm:px-5" onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Full name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">
              Password{" "}
              {editingUserId && (
                <span style={{ color: "#9CA3AF", fontWeight: 400 }}>(leave blank to keep current)</span>
              )}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
                minLength={8}
                required={!editingUserId}
                style={{ paddingRight: "2.75rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#9CA3AF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="form-label">Role</label>
            <select
              className="form-input"
              value={form.role}
              onChange={(event) => updateForm("role", event.target.value)}
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {editingUserId && (
            <div>
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={form.isActive ? "true" : "false"}
                onChange={(event) => updateForm("isActive", event.target.value === "true")}
              >
                <option value="true">Active</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          )}

          <div className={editingUserId ? "grid grid-cols-2 gap-2 sm:flex sm:flex-row" : "flex flex-col gap-3 sm:flex-row"}>
            {editingUserId && (
              <Button
                type="button"
                variant="outline-green"
                onClick={cancelEdit}
                disabled={submitting}
                className="w-full"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" variant="green" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Saving..." : editingUserId ? "Update user" : "Create user"}
            </Button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-4 py-4 sm:px-5">
          <h2 className="text-lg font-bold text-[#101828]">Authorized users</h2>
          <p className="text-sm text-[#667085]">Current admins and editors with CMS access.</p>
        </div>

        <div className="divide-y divide-[#F2F4F7] md:hidden">
          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-[#667085]">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-[#667085]">No users found.</div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="space-y-4 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-[#101828]">{user.name}</p>
                    <p className="break-all text-sm text-[#475467]">{user.email}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(user)}
                      aria-label={`Edit ${user.name}`}
                      title={`Edit ${user.name}`}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D0D5DD] text-[#4F7B44]"
                    >
                      <Edit2 size={14} />
                    </button>
                    {user._id !== currentUser?._id && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserToDelete(user);
                          setShowDeleteConfirm(true);
                        }}
                        aria-label={`Delete ${user.name}`}
                        title={`Delete ${user.name}`}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FECACA] text-[#B42318] bg-white transition-colors hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#F9FAFB] p-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98A2B3]">Role</p>
                    <p className="mt-1 text-sm text-[#475467]">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98A2B3]">Status</p>
                    <p className="mt-1 text-sm text-[#475467]">{user.isActive ? "Active" : "Disabled"}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-[#E5E7EB]">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#667085]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#667085]">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#667085]">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-5 py-4 text-sm font-medium text-[#101828]">{user.name}</td>
                    <td className="px-5 py-4 text-sm text-[#475467]">{user.email}</td>
                    <td className="px-5 py-4 text-sm text-[#475467]">{user.role}</td>
                    <td className="px-5 py-4 text-sm text-[#475467]">
                      {user.isActive ? "Active" : "Disabled"}
                    </td>
                    <td className="px-5 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <EditUserButton onClick={() => handleEdit(user)} />
                        {user._id !== currentUser?._id && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteConfirm(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-[#B42318] transition-colors hover:bg-red-50"
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
    </>
  );
}
