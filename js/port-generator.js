class PortGenerator {
    generatePortsForMode(mode) {
        if (mode === 'Regular') {
            return [
                // Top 3:1 ports (between 0-1 and touching top of 1)
                {
                    pos: [-0.25, -2.5],
                    type: '3:1',
                    anchorHex: [2, 2]
                },
                
                // Top right 3:1 port on tile 2
                {
                    pos: [1.25, -2.5],
                    type: '3:1',
                    anchorHex: [2, 2]
                },
                
                // Brick port (6 and 11)
                {
                    pos: [2.0, -1],
                    type: 'brick',
                    anchorHex: [2, 2]
                },
                
                // Wood port (11 and 15)
                {
                    pos: [2, 1],
                    type: 'wood',
                    anchorHex: [2, 2]
                },
                
                // Bottom right 3:1 (18)
                {
                    pos: [1.25, 2.5],
                    type: '3:1',
                    anchorHex: [2, 2]
                },
                
                // Wheat port (16-17)
                {
                    pos: [-0.25, 2.5],
                    type: 'wheat',
                    anchorHex: [2, 2]
                },
                
                // Ore port (12-16)
                {
                    pos: [-1.75, 1.5],
                    type: 'ore',
                    anchorHex: [2, 2]
                },
                
                // Left 3:1 port (7)
                {
                    pos: [-2.5, 0],
                    type: '3:1',
                    anchorHex: [2, 2]
                },
                
                // Sheep port (1-3)
                {
                    pos: [-1.75, -1.5],
                    type: 'sheep',
                    anchorHex: [2, 2]
                }
            ];
        } else if (mode === 'Expansion') {
            return [
                // 3:1 port just touching 0
                {
                    pos: [-1.25, -3.5],
                    type: '3:1',
                    anchorHex: [3, 3]  // Center tile (14)
                },
                
                // Sheep port between 2 and 3
                {
                    pos: [0.25, -3.5],
                    type: 'sheep',
                    anchorHex: [3, 3]
                },
                
                // 3:1 port touching 2, 6 and on 6
                {
                    pos: [1.75, -2.5],
                    type: '3:1',
                    anchorHex: [3, 3]
                },
                
                // 3:1 port on just 17
                {
                    pos: [3.0, 0],
                    type: '3:1',
                    anchorHex: [3, 3]
                },
                
                // Brick port on 22 and touching 22/26
                {
                    pos: [2.25, 1.5],
                    type: 'brick',
                    anchorHex: [3, 3]
                },
                
                // Sheep port on 29 and touching 29/26
                {
                    pos: [1.75, 2.5],
                    type: 'sheep',
                    anchorHex: [3, 3]
                },
                
                // Wood port on 28 and touching 28/29
                {
                    pos: [0.25, 3.5],
                    type: 'wood',
                    anchorHex: [3, 2]
                },
                
                // 3:1 port on 18 and touching 18/23
                {
                    pos: [-1.25, 3.5],
                    type: '3:1',
                    anchorHex: [3, 3]
                },
                
                // Wheat port on 23 and touching 18/23
                {
                    pos: [-2, 2],
                    type: 'wheat',
                    anchorHex: [3, 3]
                },

                // 3:1 port on just 27
                {
                    pos: [-2.75, 0.5],
                    type: '3:1',
                    anchorHex: [3, 3]
                },
                
                // Ore port on 18, 12 and just 12
                {
                    pos: [-2.5, -1],
                    type: 'ore',
                    anchorHex: [3, 3]
                }
            ];
        }
        return [];
    }
}

export default PortGenerator;