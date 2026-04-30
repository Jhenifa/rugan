import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import api from "@/lib/api";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "editor",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

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
      await api.post("/auth/register", form);
      toast.success("User created.");
      setForm(EMPTY_FORM);
      await loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create user.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
      <section className="rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-lg font-bold text-[#101828]">Create user</h2>
          <p className="text-sm text-[#667085]">
            Admins can create editor and admin accounts for the CMS.
          </p>
        </div>

        <form className="space-y-5 px-5 py-5" onSubmit={handleSubmit}>
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
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={form.password}
              onChange={(event) => updateForm("password", event.target.value)}
              minLength={8}
              required
            />
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

          <Button type="submit" variant="green" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Creating..." : "Create user"}
          </Button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-lg font-bold text-[#101828]">Authorized users</h2>
          <p className="text-sm text-[#667085]">
            Current admins and editors with CMS access.
          </p>
        </div>

        <div className="overflow-x-auto">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#667085]">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#667085]">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
