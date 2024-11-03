import React from 'react';

const NavBar = ({ setSelectedTreater }) => {
  return (
    <nav>
      <ul>
        <li onClick={() => setSelectedTreater('כולם')}>כולם</li>
        <li onClick={() => setSelectedTreater('טלי')}>טלי</li>
        <li onClick={() => setSelectedTreater('עידו')}>עידו</li>
        <li onClick={() => setSelectedTreater('גיא')}>גיא</li>
        <li onClick={() => setSelectedTreater('מגי')}>מגי</li>
        <li onClick={() => setSelectedTreater('אברהם')}>אברהם </li>
        <li onClick={() => setSelectedTreater('סגורות')}>קריאות סגורות  </li>

      </ul>
    </nav>
  );
};

export default NavBar;
