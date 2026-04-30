const fullAccessUsers = [
  {
    id: "1",
    name: "Remi Wilkins",
    title: "Business Administrator",
    badge: "Admin",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
];

const viewOnlyUsers = [
  {
    id: "2",
    name: "Adam Benson",
    title: "Business Administrator",
    badge: "Admin",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Pauline Thomas",
    title: "Business Administrator",
    badge: "Admin",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
  },
];

export function RolesPermissionsPage() {
  return (
    <div className="wb-roles-page">
      <div className="wb-roles-page__intro">
        <h1 className="wb-roles-page__title">Roles &amp; Permissions</h1>
        <p className="wb-roles-page__sub">Manage user access levels</p>
      </div>

      <RoleSection id="roles-section-full" heading="Full Access (1)" users={fullAccessUsers} />
      <RoleSection id="roles-section-view" heading="View Only (2)" users={viewOnlyUsers} />
    </div>
  );
}

function RoleSection({
  id,
  heading,
  users,
}: {
  id: string;
  heading: string;
  users: { id: string; name: string; title: string; badge: string; photo: string }[];
}) {
  return (
    <section className="wb-roles-panel" aria-labelledby={id}>
      <div className="wb-roles-panel__toolbar">
        <h2 className="wb-roles-panel__title" id={id}>
          {heading}
        </h2>
        <div className="wb-roles-panel__actions">
          <button type="button" className="wb-profile-field__edit wb-roles-panel__edit">
            Edit <span aria-hidden>✎</span>
          </button>
          <button type="button" className="wb-btn wb-btn--dark wb-roles-panel__assign">
            <IconPersonPlus />
            Assign Admin Role
          </button>
        </div>
      </div>
      <div className="wb-roles-panel__body">
        {users.map((u) => (
          <article key={u.id} className="wb-roles-user">
            <img className="wb-roles-user__avatar" src={u.photo} width={48} height={48} alt="" />
            <div className="wb-roles-user__text">
              <span className="wb-roles-user__name">{u.name}</span>
              <span className="wb-roles-user__title">{u.title}</span>
            </div>
            <span className="wb-roles-user__badge">{u.badge}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function IconPersonPlus() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M10 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3.5 17.5v-1A5.5 5.5 0 0110 11a5.5 5.5 0 015.5 5.5v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 6v4M14 8h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
