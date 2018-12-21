class AddTimeToRecords < ActiveRecord::Migration[5.2]
  def change
    add_column :records, :time, :datetime
  end
end
