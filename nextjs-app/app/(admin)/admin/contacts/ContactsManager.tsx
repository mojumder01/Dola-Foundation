"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Trash2, CheckCircle, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { markContactRead, deleteContact } from "@/actions/admin/contacts";

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export default function ContactsManager({ contacts }: { contacts: Contact[] }) {
  const [selected, setSelected] = useState<Contact | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleMarkRead(contact: Contact) {
    if (contact.isRead) return;
    startTransition(async () => {
      await markContactRead(contact.id);
      router.refresh();
    });
  }

  function handleDelete(contact: Contact) {
    if (!confirm(`Delete message from ${contact.name}?`)) return;
    startTransition(async () => {
      await deleteContact(contact.id);
      if (selected?.id === contact.id) setSelected(null);
      router.refresh();
    });
  }

  const unread = contacts.filter((c) => !c.isRead).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-poppins font-bold text-2xl text-dark">Contact Messages</h1>
        <p className="text-gray-500 text-sm mt-1">
          {unread} unread message{unread !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-dark">All Messages ({contacts.length})</h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
            {contacts.length === 0 ? (
              <p className="text-gray-400 text-center py-10 text-sm">No messages yet</p>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => { setSelected(contact); handleMarkRead(contact); }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === contact.id ? "bg-blue-50 border-l-4 border-primary" : ""} ${!contact.isRead ? "bg-yellow-50/50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!contact.isRead && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                        <p className="font-semibold text-sm text-dark truncate">{contact.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{contact.subject}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{contact.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs text-gray-400">{formatDate(contact.createdAt)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(contact); }}
                        disabled={isPending}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-poppins font-bold text-lg text-dark">{selected.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={selected.isRead ? "approved" : "pending"}>
                      {selected.isRead ? "Read" : "Unread"}
                    </Badge>
                    <span className="text-xs text-gray-400">{formatDate(selected.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <span className="font-semibold text-dark">{selected.name}</span>
                </div>
                <a href={`mailto:${selected.email}`} className="text-primary text-xs flex items-center gap-1 hover:underline">
                  <Mail className="w-3.5 h-3.5" />
                  {selected.email}
                </a>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                {selected.message}
              </div>

              <div className="flex gap-3 mt-5">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="flex-1 bg-primary text-white text-sm font-semibold py-2.5 rounded-xl text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selected)}
                  disabled={isPending}
                  className="px-4 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
