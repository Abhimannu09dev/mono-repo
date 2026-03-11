"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";

interface Folder {
  _id: string;
  name: string;
}
interface File {
  _id: string;
  fileName: string;
  mimeType: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [folderName, setFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [fileToUpload, setFileToUpload] = useState<globalThis.File | null>(
    null,
  );
  const [shareLinks, setShareLinks] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      fetchFolders();
      fetchFiles();
    }
  }, []);

  const fetchFolders = async () => {
    const res = await api.get("/folders/get");
    setFolders(res.data.data.folders);
  };

  const fetchFiles = async (folderId?: string) => {
    const url = folderId ? `/files?folderId=${folderId}` : "/files";
    const res = await api.get(url);
    setFiles(res.data.data.files);
  };

  const createFolder = async () => {
    if (!folderName.trim()) return;
    try {
      await api.post("/folders/create", { name: folderName });
      setFolderName("");
      fetchFolders();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create folder");
    }
  };

  const deleteFolder = async (folderId: string) => {
    await api.delete(`/folders/delete/${folderId}`);
    fetchFolders();
    if (selectedFolder === folderId) {
      setSelectedFolder("");
      fetchFiles();
    }
  };

  const uploadFile = async () => {
    if (!fileToUpload) return;
    const formData = new FormData();
    formData.append("file", fileToUpload);
    if (selectedFolder) formData.append("folderId", selectedFolder);
    try {
      await api.post("/files", formData);
      setFileToUpload(null);
      fetchFiles(selectedFolder);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to upload file");
    }
  };

  const deleteFile = async (fileId: string) => {
    await api.delete(`/files/${fileId}`);
    fetchFiles(selectedFolder);
  };

  const generateShareLink = async (fileId: string) => {
    try {
      const res = await api.post(`/share/${fileId}/generate`);
      setShareLinks((prev) => ({ ...prev, [fileId]: res.data.data.shareLink }));
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate link");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <div
      style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Dashboard</h2>
        <button onClick={logout} style={btnStyle}>
          Logout
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Folders */}
      <section style={sectionStyle}>
        <h3>Folders</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            style={{ padding: 8, flex: 1 }}
          />
          <button onClick={createFolder} style={btnStyle}>
            Create
          </button>
        </div>
        {selectedFolder && (
          <p style={{ fontSize: 13, marginTop: 8 }}>
            Filtering files by folder —{" "}
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => {
                setSelectedFolder("");
                fetchFiles();
              }}
            >
              clear filter
            </span>
          </p>
        )}
        <ul style={{ marginTop: 12, paddingLeft: 0, listStyle: "none" }}>
          {folders.map((f) => (
            <li
              key={f._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span
                style={{
                  cursor: "pointer",
                  fontWeight: selectedFolder === f._id ? "bold" : "normal",
                }}
                onClick={() => {
                  setSelectedFolder(f._id);
                  fetchFiles(f._id);
                }}
              >
                {f.name}
              </span>
              <button
                onClick={() => deleteFolder(f._id)}
                style={dangerBtnStyle}
              >
                Delete
              </button>
            </li>
          ))}
          {folders.length === 0 && (
            <p style={{ color: "#888", fontSize: 13 }}>No folders yet</p>
          )}
        </ul>
      </section>

      {/* Files */}
      <section style={sectionStyle}>
        <h3>Files {selectedFolder ? "(filtered by folder)" : "(all)"}</h3>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.txt"
            onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
          />
          <button onClick={uploadFile} style={btnStyle}>
            Upload
          </button>
        </div>
        <ul style={{ marginTop: 12, paddingLeft: 0, listStyle: "none" }}>
          {files.map((f) => (
            <li
              key={f._id}
              style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {f.fileName}{" "}
                  <small style={{ color: "#888" }}>({f.mimeType})</small>
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => generateShareLink(f._id)}
                    style={btnStyle}
                  >
                    Share
                  </button>
                  <button
                    onClick={() => deleteFile(f._id)}
                    style={dangerBtnStyle}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {shareLinks[f._id] && (
                <div
                  style={{ marginTop: 4, fontSize: 13, wordBreak: "break-all" }}
                >
                  🔗{" "}
                  <a href={shareLinks[f._id]} target="_blank" rel="noreferrer">
                    {shareLinks[f._id]}
                  </a>
                </div>
              )}
            </li>
          ))}
          {files.length === 0 && (
            <p style={{ color: "#888", fontSize: 13 }}>No files yet</p>
          )}
        </ul>
      </section>
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  marginBottom: 40,
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 8,
};
const btnStyle: React.CSSProperties = {
  padding: "6px 12px",
  cursor: "pointer",
};
const dangerBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  cursor: "pointer",
  color: "red",
  background: "none",
  border: "none",
};
