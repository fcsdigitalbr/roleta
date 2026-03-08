import React from 'react';

const BasicTest = () => {
  console.log('BasicTest component rendered');
  
  const handleClick = () => {
    console.log('Basic button clicked!');
    alert('Basic button works!');
  };

  // Test if the component is mounting
  React.useEffect(() => {
    console.log('BasicTest component mounted');
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Basic Test Page</h1>
        <p>If you can see this, React is working</p>
        <button 
          onClick={handleClick}
          onMouseOver={() => console.log('Button hovered')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          Click Me
        </button>
        <p style={{ marginTop: '10px', fontSize: '12px' }}>
          Check browser console for debug messages
        </p>
      </div>
    </div>
  );
};

export default BasicTest;