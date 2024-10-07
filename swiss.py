import random

list2_1 = {
    "DK": ["FNC", "FLY", "LNG"],
    "FLY": ["MAD", "DK", "PSG"],
    "G2": ["PNG", "HLE", "WBG"],
    "HLE": ["PSG", "G2", "GEN"],
    "T1": ["TES", "PNG", "BLG"],
    "TES": ["T1", "GEN", "FNC"],
}

list1_2 = {
    "BLG": ["MAD", "LNG", "T1"],
    "FNC": ["DK", "GAM", "TES"],
    "PSG": ["HLE", "MAD", "FLY"],
    "WBG": ["GEN", 'TL', 'G2'],
}

list0_2 = {
    'GAM': ['FLY', 'FNC', 'MAD'],
    'MAD': ['BLG', 'PSG', 'GAM'],
    'PNG': ['G2', 'T1', 'TL'],
    'TL': ['LNG', 'WBG', 'PNG'],
}
    
# 0-2交战
battle0_2 = [['GAM', 'MAD'], ['PNG', 'TL']]

iter = 0
while(iter<1):
    # 0-2交战
    for battle in battle0_2:
        team1 = battle[0]
        team2 = battle[1]
        if random.randint(0, 1) == 0:
            list1_2[team1] = list0_2[team1]
        else:
            list1_2[team2] = list0_2[team2]
    
    battle2_1 = [[0, 0]]
    # 2-1交战，随机选2个组成一组
    team1, team2 = random.sample(list2_1.keys(), 2)
    battle2_1.append([team1, team2])
    print(battle2_1)
        
            
    iter += 1