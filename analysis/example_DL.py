import numpy as np
from weighted_levenshtein import lev, osa, dam_lev


insert_costs = np.ones(128, dtype=np.float64)  # make an array of all 1's of size 128, the number of ASCII characters
insert_costs[ord('D')] = 1.5  # make inserting the character 'D' have cost 1.5 (instead of 1)

# you can just specify the insertion costs
# delete_costs and substitute_costs default to 1 for all characters if unspecified
print(lev('BANANAS', 'BANDANAS', insert_costs=insert_costs))  # prints '1.5'

delete_costs = np.ones(128, dtype=np.float64)
delete_costs[ord('S')] = 0.5  # make deleting the character 'S' have cost 0.5 (instead of 1)

# or you can specify both insertion and deletion costs (though in this case insertion costs don't matter)
print(lev('BANANAS', 'BANANA', insert_costs=insert_costs, delete_costs=delete_costs))  # prints '0.5'


substitute_costs = np.ones((128, 128), dtype=np.float64)  # make a 2D array of 1's
substitute_costs[ord('H'), ord('B')] = 1.25  # make substituting 'H' for 'B' cost 1.25

print(lev('HANANA', 'BANANA', substitute_costs=substitute_costs))  # prints '1.25'

# it's not symmetrical! in this case, it is substituting 'B' for 'H'
print(lev('BANANA', 'HANANA', substitute_costs=substitute_costs))  # prints '1'

# to make it symmetrical, you need to set both costs in the 2D array
substitute_costs[ord('B'), ord('H')] = 1.25  # make substituting 'B' for 'H' cost 1.25 as well

print(lev('BANANA', 'HANANA', substitute_costs=substitute_costs))  # now it prints '1.25'


transpose_costs = np.ones((128, 128), dtype=np.float64)
transpose_costs[ord('A'), ord('B')] = 0.75  # make swapping 'A' for 'B' cost 0.75

# note: now using dam_lev. lev does not support swapping, but osa and dam_lev do.
# See Wikipedia links for difference between osa and dam_lev
print(dam_lev('ABNANA', 'BANANA', transpose_costs=transpose_costs))  # prints '0.75'

# like substitution, transposition is not symmetrical either!
print(dam_lev('BANANA', 'ABNANA', transpose_costs=transpose_costs))  # prints '1'

# you need to explicitly set the other direction as well
transpose_costs[ord('B'), ord('A')] = 0.75  # make swapping 'B' for 'A' cost 0.75

print(dam_lev('BANANA', 'ABNANA', transpose_costs=transpose_costs))  # now it prints '0.75'